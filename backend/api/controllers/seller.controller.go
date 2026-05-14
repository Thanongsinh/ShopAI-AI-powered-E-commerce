package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/data/services"
	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
)

type SellerController struct {
	products *services.ProductService
	prodRepo *repositories.ProductRepository
	orders   *repositories.OrderRepository
	shops    *repositories.ShopRepository
}

func NewSellerController(
	p *services.ProductService,
	prodRepo *repositories.ProductRepository,
	o *repositories.OrderRepository,
	s *repositories.ShopRepository,
) *SellerController {
	return &SellerController{p, prodRepo, o, s}
}

// shopFor resolves (or auto-creates) the shop owned by the authenticated seller.
func (h *SellerController) shopFor(c *fiber.Ctx) (*entities.Shop, error) {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	shop, err := h.shops.ByUserID(uid)
	if err == nil {
		return shop, nil
	}
	shop = &entities.Shop{
		UserID: uid, Name: "ร้านของฉัน", Logo: "🏪", IsVerified: false,
	}
	if err := h.shops.Create(shop); err != nil {
		return nil, err
	}
	return shop, nil
}

func (h *SellerController) Dashboard(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	orders, _ := h.orders.ListByShop(shop.ID)
	prods, _ := h.prodRepo.ByShop(shop.ID)
	var revenue float64
	for _, o := range orders {
		revenue += o.Total
	}
	rev := buildDailyRevenue(orders, 7)
	return utilities.OK(c, fiber.Map{
		"shop":          shop,
		"revenue":       revenue,
		"orders_count":  len(orders),
		"products":      len(prods),
		"recent_orders": firstN(orders, 5),
		"revenue_chart": rev,
	})
}

func (h *SellerController) Products(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	items, err := h.prodRepo.ByShop(shop.ID)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *SellerController) CreateProduct(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	var req models.ProductUpsertRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if req.Name == "" || req.Price <= 0 {
		return utilities.BadRequest(c, "name and price required")
	}
	p := &entities.Product{
		ShopID:        shop.ID,
		Name:          req.Name,
		Description:   req.Description,
		Price:         req.Price,
		OriginalPrice: req.OriginalPrice,
		Stock:         req.Stock,
		CategorySlug:  req.CategorySlug,
		Icon:          req.Icon,
		ColorFrom:     defaultStr(req.ColorFrom, "#6366F1"),
		ColorTo:       defaultStr(req.ColorTo, "#8B5CF6"),
		Colors:        pq.StringArray(req.Colors),
		Sizes:         pq.StringArray(req.Sizes),
		Specs:         req.Specs,
		Status:        defaultStr(req.Status, "active"),
		IsNew:         true,
	}
	if req.OriginalPrice > req.Price && req.OriginalPrice > 0 {
		p.Discount = int(100 * (req.OriginalPrice - req.Price) / req.OriginalPrice)
	}
	if err := h.products.Save(p); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.Created(c, p)
}

func (h *SellerController) UpdateProduct(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	p, err := h.prodRepo.FindByID(uint(id))
	if err != nil {
		return utilities.NotFound(c, "product not found")
	}
	if p.ShopID != shop.ID {
		return utilities.Err(c, fiber.StatusForbidden, "not your product")
	}
	var req models.ProductUpsertRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if req.Name != "" {
		p.Name = req.Name
	}
	if req.Description != "" {
		p.Description = req.Description
	}
	if req.Price > 0 {
		p.Price = req.Price
	}
	if req.OriginalPrice > 0 {
		p.OriginalPrice = req.OriginalPrice
	}
	if req.Stock >= 0 {
		p.Stock = req.Stock
	}
	if req.CategorySlug != "" {
		p.CategorySlug = req.CategorySlug
	}
	if req.Status != "" {
		p.Status = req.Status
	}
	if len(req.Colors) > 0 {
		p.Colors = pq.StringArray(req.Colors)
	}
	if len(req.Sizes) > 0 {
		p.Sizes = pq.StringArray(req.Sizes)
	}
	if req.Specs != "" {
		p.Specs = req.Specs
	}
	if p.OriginalPrice > p.Price && p.OriginalPrice > 0 {
		p.Discount = int(100 * (p.OriginalPrice - p.Price) / p.OriginalPrice)
	}
	if err := h.products.Save(p); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, p)
}

func (h *SellerController) DeleteProduct(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	p, err := h.prodRepo.FindByID(uint(id))
	if err != nil {
		return utilities.NotFound(c, "product not found")
	}
	if p.ShopID != shop.ID {
		return utilities.Err(c, fiber.StatusForbidden, "not your product")
	}
	if err := h.products.Delete(uint(id)); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"deleted": true})
}

func (h *SellerController) GetShop(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, shop)
}

func (h *SellerController) UpdateShop(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	var req models.ShopUpdateRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if req.Name != "" {
		shop.Name = req.Name
	}
	if req.Description != "" {
		shop.Description = req.Description
	}
	if req.Logo != "" {
		shop.Logo = req.Logo
	}
	if err := h.shops.Save(shop); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, shop)
}

func (h *SellerController) ShopOrders(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	items, err := h.orders.ListByShop(shop.ID)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *SellerController) Analytics(c *fiber.Ctx) error {
	shop, err := h.shopFor(c)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	orders, _ := h.orders.ListByShop(shop.ID)
	prods, _ := h.prodRepo.ByShop(shop.ID)

	catCount := map[string]int{}
	for _, p := range prods {
		catCount[p.CategorySlug] += p.SoldCount
	}
	topCats := make([]string, 0, len(catCount))
	for slug, n := range catCount {
		if n > 0 {
			topCats = append(topCats, slug)
		}
	}

	low := make([]string, 0)
	for _, p := range prods {
		if p.Status == "active" && p.Stock > 0 && p.Stock < 5 {
			low = append(low, p.Name+" (เหลือ "+strconv.Itoa(p.Stock)+" ชิ้น)")
		}
	}

	return utilities.OK(c, fiber.Map{
		"top_categories":      topCats,
		"orders_count":        len(orders),
		"products_count":      len(prods),
		"low_stock_alert":     low,
		"price_band":          "500-2,000 ₭",
		"peak_hours":          "18:00-21:00",
		"suggested_discounts": []string{"ลด 10% เพื่อเพิ่มยอดขาย 40%"},
	})
}

// --- helpers -----------------------------------------------------------------

func defaultStr(s, fallback string) string {
	if s == "" {
		return fallback
	}
	return s
}

func firstN[T any](xs []T, n int) []T {
	if len(xs) < n {
		return xs
	}
	return xs[:n]
}

type dayPoint struct {
	Label string  `json:"label"`
	Value float64 `json:"value"`
}

func buildDailyRevenue(orders []entities.Order, days int) []dayPoint {
	now := time.Now()
	buckets := make(map[string]float64, days)
	for i := days - 1; i >= 0; i-- {
		d := now.AddDate(0, 0, -i)
		buckets[d.Format("2006-01-02")] = 0
	}
	for _, o := range orders {
		k := o.CreatedAt.Format("2006-01-02")
		if _, ok := buckets[k]; ok {
			buckets[k] += o.Total
		}
	}
	thaiDays := []string{"อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"}
	out := make([]dayPoint, 0, days)
	for i := days - 1; i >= 0; i-- {
		d := now.AddDate(0, 0, -i)
		k := d.Format("2006-01-02")
		out = append(out, dayPoint{Label: thaiDays[int(d.Weekday())], Value: buckets[k]})
	}
	return out
}
