package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/models"
)

type OrderController struct{ repo *repositories.OrderRepository }

func NewOrderController(r *repositories.OrderRepository) *OrderController {
	return &OrderController{r}
}

func (h *OrderController) MyOrders(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	items, err := h.repo.ListByBuyer(uid)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *OrderController) Get(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	o, err := h.repo.FindByID(uint(id))
	if err != nil {
		return utilities.NotFound(c, "order not found")
	}
	return utilities.OK(c, o)
}

func (h *OrderController) ShopOrders(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	// Simplification: shop_id == seller user_id in this skeleton
	items, err := h.repo.ListByShop(uid)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *OrderController) UpdateStatus(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	var req models.UpdateOrderStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if err := h.repo.UpdateStatus(uint(id), req.Status); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"updated": true})
}
