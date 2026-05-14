package handlers

import (
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type BehaviorEvent struct {
	UserID    *uint  `json:"user_id"`
	SessionID string `json:"session_id"`
	ProductID uint   `json:"product_id"`
	Action    string `json:"action"`
}

func Track(log *zap.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ev BehaviorEvent
		if err := c.BodyParser(&ev); err != nil {
			return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
		}
		// TODO: push to Redis queue, batch-flush to Postgres every 5 minutes
		log.Info("event", zap.Any("event", ev))
		return c.JSON(fiber.Map{"success": true, "data": fiber.Map{"queued": true}})
	}
}
