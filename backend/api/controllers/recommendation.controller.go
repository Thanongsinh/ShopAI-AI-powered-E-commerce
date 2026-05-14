package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
)

type RecommendationController struct{ svc *services.RecommendationService }

func NewRecommendationController(s *services.RecommendationService) *RecommendationController {
	return &RecommendationController{s}
}

func (h *RecommendationController) Popular(c *fiber.Ctx) error {
	items, err := h.svc.Popular()
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}

func (h *RecommendationController) ForUser(c *fiber.Ctx) error {
	userID, _ := c.Locals(middleware.CtxUserID).(uint)
	items, err := h.svc.ForUser(userID)
	if err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, items)
}
