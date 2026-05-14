package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

type BehaviorEvent struct {
	UserID    *uint     `json:"user_id"`
	SessionID string    `json:"session_id"`
	ProductID uint      `json:"product_id"`
	Action    string    `json:"action"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

var weights = map[string]float64{"view": 1, "wishlist": 2, "add_cart": 3, "purchase": 5}

// Weight returns the score weight for the action; 0 for unknown.
func (e BehaviorEvent) Weight() float64 { return weights[e.Action] }

type Tracker struct {
	rdb      *redis.Client
	queueKey string
	log      *zap.Logger
}

func NewTracker(rdb *redis.Client, queueKey string, log *zap.Logger) *Tracker {
	return &Tracker{rdb: rdb, queueKey: queueKey, log: log}
}

func (t *Tracker) Track() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ev BehaviorEvent
		if err := c.BodyParser(&ev); err != nil {
			return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
		}
		if err := ev.validate(); err != nil {
			return c.Status(400).JSON(fiber.Map{"success": false, "error": err.Error()})
		}
		if ev.CreatedAt.IsZero() {
			ev.CreatedAt = time.Now().UTC()
		}
		payload, err := json.Marshal(ev)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"success": false, "error": err.Error()})
		}
		ctx, cancel := context.WithTimeout(c.Context(), 2*time.Second)
		defer cancel()
		if err := t.rdb.RPush(ctx, t.queueKey, payload).Err(); err != nil {
			t.log.Warn("redis push failed", zap.Error(err))
			return c.Status(503).JSON(fiber.Map{"success": false, "error": "queue unavailable"})
		}
		return c.JSON(fiber.Map{"success": true, "data": fiber.Map{"queued": true}})
	}
}

func (e BehaviorEvent) validate() error {
	if e.SessionID == "" && e.UserID == nil {
		return errors.New("session_id or user_id required")
	}
	if e.ProductID == 0 {
		return errors.New("product_id required")
	}
	if _, ok := weights[e.Action]; !ok {
		return errors.New("invalid action")
	}
	return nil
}
