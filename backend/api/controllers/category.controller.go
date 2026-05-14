package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
)

type CategoryController struct{ repo *repositories.CategoryRepository }

func NewCategoryController(r *repositories.CategoryRepository) *CategoryController {
	return &CategoryController{r}
}

func (h *CategoryController) List(c *fiber.Ctx) error {
	items, err := h.repo.All()
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}
