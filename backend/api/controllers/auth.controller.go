package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
	"github.com/sk/shopai/backend/domain/models"
)

type AuthController struct{ svc *services.AuthService }

func NewAuthController(s *services.AuthService) *AuthController { return &AuthController{s} }

func (h *AuthController) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	res, err := h.svc.Register(req)
	if err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	return utilities.Created(c, res)
}

func (h *AuthController) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	res, err := h.svc.Login(req)
	if err != nil {
		return utilities.Unauthorized(c, err.Error())
	}
	return utilities.OK(c, res)
}

func (h *AuthController) Refresh(c *fiber.Ctx) error {
	// Stub — re-issue using same parse logic
	return utilities.OK(c, fiber.Map{"refreshed": true})
}

func (h *AuthController) BecomeSeller(c *fiber.Ctx) error {
	userID, _ := c.Locals(middleware.CtxUserID).(uint)
	u, err := h.svc.BecomeSeller(userID)
	if err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	return utilities.OK(c, u)
}
