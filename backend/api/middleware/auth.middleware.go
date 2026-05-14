package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sk/shopai/backend/core/utilities"
	"github.com/sk/shopai/backend/data/services"
)

const (
	CtxUserID = "user_id"
	CtxRole   = "user_role"
)

func RequireAuth(auth *services.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		h := c.Get("Authorization")
		if !strings.HasPrefix(h, "Bearer ") {
			return utilities.Unauthorized(c, "missing bearer token")
		}
		tok := strings.TrimPrefix(h, "Bearer ")
		userID, role, err := auth.Parse(tok)
		if err != nil {
			return utilities.Unauthorized(c, "invalid token")
		}
		c.Locals(CtxUserID, userID)
		c.Locals(CtxRole, role)
		return c.Next()
	}
}

func RequireRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		r, _ := c.Locals(CtxRole).(string)
		for _, want := range roles {
			if r == want {
				return c.Next()
			}
		}
		return utilities.Err(c, fiber.StatusForbidden, "forbidden")
	}
}
