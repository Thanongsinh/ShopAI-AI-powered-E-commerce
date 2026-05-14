package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
)

type WishlistController struct{ repo *repositories.WishlistRepository }

func NewWishlistController(r *repositories.WishlistRepository) *WishlistController {
	return &WishlistController{r}
}

func (h *WishlistController) List(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	items, err := h.repo.List(uid)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *WishlistController) Add(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	var body struct {
		ProductID uint `json:"product_id"`
	}
	if err := c.BodyParser(&body); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if err := h.repo.Add(uid, body.ProductID); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"added": true})
}

func (h *WishlistController) Remove(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	pid, _ := strconv.ParseUint(c.Params("productId"), 10, 64)
	if err := h.repo.Remove(uid, uint(pid)); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"removed": true})
}
