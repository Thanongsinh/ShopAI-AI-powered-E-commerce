package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/api/middleware"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
	"github.com/sk/shopai/backend/domain/models"
)

type EventController struct{ svc *services.EventService }

func NewEventController(s *services.EventService) *EventController {
	return &EventController{s}
}

func (h *EventController) Track(c *fiber.Ctx) error {
	var req models.EventRequest
	if err := c.BodyParser(&req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	// Stamp authenticated user id if available so guest sessions still flow,
	// and logged-in events get attached to the correct user.
	if req.UserID == nil {
		if uid, ok := c.Locals(middleware.CtxUserID).(uint); ok && uid > 0 {
			req.UserID = &uid
		}
	}
	if err := h.svc.Track(c.Context(), req); err != nil {
		return utilities.BadRequest(c, err.Error())
	}
	return utilities.OK(c, fiber.Map{"queued": true})
}
