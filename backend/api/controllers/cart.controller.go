package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
	"github.com/sk/shopai/backend/domain/models"
)

type CartController struct{ svc *services.CartService }

func NewCartController(s *services.CartService) *CartController { return &CartController{s} }

func (h *CartController) List(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	items, err := h.svc.List(uid)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *CartController) Add(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	var req models.CartItemRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if err := h.svc.Upsert(uid, req); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"updated": true})
}

func (h *CartController) Remove(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	pid, _ := strconv.ParseUint(c.Params("productId"), 10, 64)
	if err := h.svc.Remove(uid, uint(pid)); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"removed": true})
}

func (h *CartController) Checkout(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	var req models.CheckoutRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	order, err := h.svc.Checkout(uid, req)
	if err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	return utilities.Created(c, order)
}
