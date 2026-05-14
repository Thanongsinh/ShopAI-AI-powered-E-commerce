package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/data/services"
)

type SellerController struct {
	products *services.ProductService
	orders   *repositories.OrderRepository
}

func NewSellerController(p *services.ProductService, o *repositories.OrderRepository) *SellerController {
	return &SellerController{p, o}
}

func (h *SellerController) Dashboard(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	orders, _ := h.orders.ListByShop(uid)
	prods, _ := h.products.ByShop(uid)
	var revenue float64
	for _, o := range orders {
		revenue += o.Total
	}
	return utilities.OK(c, fiber.Map{
		"revenue":      revenue,
		"orders_count": len(orders),
		"products":     len(prods),
		"orders":       orders,
	})
}

func (h *SellerController) Products(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	items, err := h.products.ByShop(uid)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *SellerController) Analytics(c *fiber.Ctx) error {
	// Stub AI insights — real version reads from ml-service
	return utilities.OK(c, fiber.Map{
		"top_categories":      []string{"อิเล็กทรอนิกส์", "แฟชั่น"},
		"price_band":          "500-2,000 ₭",
		"peak_hours":          "18:00-21:00",
		"low_stock_alert":     []string{"iPhone Case (เหลือ 2 ชิ้น)"},
		"suggested_discounts": []string{"ลด 10% เพื่อเพิ่มยอดขาย 40%"},
	})
}
