package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
)

type ProfileController struct{ users *repositories.UserRepository }

func NewProfileController(u *repositories.UserRepository) *ProfileController {
	return &ProfileController{u}
}

func (h *ProfileController) Get(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	u, err := h.users.FindByID(uid)
	if err != nil {
		return utilities.NotFound(c, "user not found")
	}
	return utilities.OK(c, u)
}

func (h *ProfileController) Update(c *fiber.Ctx) error {
	uid, _ := c.Locals(middleware.CtxUserID).(uint)
	u, err := h.users.FindByID(uid)
	if err != nil {
		return utilities.NotFound(c, "user not found")
	}
	var body struct {
		Name   string `json:"name"`
		Phone  string `json:"phone"`
		Avatar string `json:"avatar"`
	}
	if err := c.BodyParser(&body); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	if body.Name != "" {
		u.Name = body.Name
	}
	if body.Phone != "" {
		u.Phone = body.Phone
	}
	if body.Avatar != "" {
		u.Avatar = body.Avatar
	}
	if err := h.users.Save(u); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, u)
}
