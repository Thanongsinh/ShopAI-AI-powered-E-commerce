package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
	"github.com/sk/shopai/backend/domain/models"
)

type ProductController struct {
	svc  *services.ProductService
	recs *services.RecommendationService
}

func NewProductController(s *services.ProductService, r *services.RecommendationService) *ProductController {
	return &ProductController{s, r}
}

func (h *ProductController) List(c *fiber.Ctx) error {
	page, limit := utilities.ParsePagination(c)
	minP, _ := strconv.ParseFloat(c.Query("min_price", "0"), 64)
	maxP, _ := strconv.ParseFloat(c.Query("max_price", "0"), 64)
	items, total, err := h.svc.List(models.ProductFilter{
		CategorySlug: c.Query("category"),
		Q:            c.Query("q"),
		MinPrice:     minP,
		MaxPrice:     maxP,
		Sort:         c.Query("sort"),
		OnlyAI:       c.Query("ai") == "1",
		Page:         page, Limit: limit,
	})
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	totalPages := int(total) / limit
	if int(total)%limit > 0 {
		totalPages++
	}
	return utilities.OK(c, models.PaginatedResult[any]{
		Items: toAnySlice(items),
		Pagination: models.Pagination{
			Page: page, Limit: limit, Total: total, TotalPages: totalPages,
		},
	})
}

func (h *ProductController) Get(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	p, err := h.svc.Get(uint(id))
	if err != nil {
		return utilities.NotFound(c, "product not found")
	}
	return utilities.OK(c, p)
}

func (h *ProductController) Similar(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	items, err := h.recs.Similar(uint(id))
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *ProductController) Trending(c *fiber.Ctx) error {
	items, err := h.svc.Trending()
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func toAnySlice[T any](in []T) []any {
	out := make([]any, len(in))
	for i, v := range in {
		out[i] = v
	}
	return out
}
