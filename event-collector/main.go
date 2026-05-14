package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/sk/shopai/event-collector/handlers"
	"go.uber.org/zap"
)

func main() {
	log, _ := zap.NewDevelopment()
	defer log.Sync()

	app := fiber.New(fiber.Config{AppName: "ShopAI Event Collector"})
	app.Use(logger.New())
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "event-collector"})
	})
	app.Post("/events", handlers.Track(log))

	log.Info("event-collector listening", zap.String("port", "8002"))
	if err := app.Listen(":8002"); err != nil {
		log.Fatal("listen failed", zap.Error(err))
	}
}
