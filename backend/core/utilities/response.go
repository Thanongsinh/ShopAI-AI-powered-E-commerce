package utilities

import "github.com/gofiber/fiber/v2"

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func OK(c *fiber.Ctx, data interface{}) error {
	return c.JSON(Response{Success: true, Data: data})
}

func Created(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusCreated).JSON(Response{Success: true, Data: data})
}

func Err(c *fiber.Ctx, code int, msg string) error {
	return c.Status(code).JSON(Response{Success: false, Error: msg})
}

func BadRequest(c *fiber.Ctx, msg string) error {
	return Err(c, fiber.StatusBadRequest, msg)
}

func Unauthorized(c *fiber.Ctx, msg string) error {
	return Err(c, fiber.StatusUnauthorized, msg)
}

func NotFound(c *fiber.Ctx, msg string) error {
	return Err(c, fiber.StatusNotFound, msg)
}

func Internal(c *fiber.Ctx, msg string) error {
	return Err(c, fiber.StatusInternalServerError, msg)
}
