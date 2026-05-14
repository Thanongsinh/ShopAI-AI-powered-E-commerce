package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
)

type EventController struct{ repo *repositories.BehaviorRepository }

func NewEventController(r *repositories.BehaviorRepository) *EventController {
	return &EventController{r}
}

var weights = map[string]float64{"view": 1, "wishlist": 2, "add_cart": 3, "purchase": 5}

func (h *EventController) Track(c *fiber.Ctx) error {
	var req models.EventRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	w, ok := weights[req.Action]
	if !ok {
		return utilities.BadRequest(c, "invalid action")
	}
	b := &entities.Behavior{
		UserID:    req.UserID,
		SessionID: req.SessionID,
		ProductID: req.ProductID,
		Action:    req.Action,
		Weight:    w,
		CreatedAt: time.Now(),
	}
	if err := h.repo.Track(b); err != nil {
		return utilities.Internal(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"tracked": true})
}
