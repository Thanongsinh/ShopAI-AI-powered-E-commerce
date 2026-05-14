package main

import (
	"context"
	"database/sql"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/sk/shopai/event-collector/handlers"
	"github.com/sk/shopai/event-collector/worker"
)

func main() {
	log, _ := zap.NewDevelopment()
	defer log.Sync()

	cfg := LoadConfig()

	rdb := redis.NewClient(&redis.Options{Addr: cfg.RedisAddr})
	defer rdb.Close()

	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatal("postgres open failed", zap.Error(err))
	}
	defer db.Close()
	db.SetMaxOpenConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Background flusher
	rootCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	flusher := worker.New(rdb, db, log, worker.Options{
		QueueKey:     cfg.QueueKey,
		CounterKey:   cfg.CounterKey,
		BatchSize:    cfg.BatchSize,
		Interval:     time.Duration(cfg.FlushIntervalS) * time.Second,
		RetrainAt:    cfg.RetrainAtCount,
		MLServiceURL: cfg.MLServiceURL,
	})
	go flusher.Run(rootCtx)

	tracker := handlers.NewTracker(rdb, cfg.QueueKey, log)

	app := fiber.New(fiber.Config{AppName: "ShopAI Event Collector"})
	app.Use(logger.New())
	app.Use(cors.New())

	app.Get("/health", func(c *fiber.Ctx) error {
		ctx, cc := context.WithTimeout(c.Context(), 500*time.Millisecond)
		defer cc()
		queued, _ := rdb.LLen(ctx, cfg.QueueKey).Result()
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "event-collector",
			"queued":  queued,
		})
	})
	app.Post("/events", tracker.Track())

	// Graceful shutdown
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
		<-sig
		log.Info("shutting down")
		cancel()
		_ = app.ShutdownWithTimeout(5 * time.Second)
	}()

	log.Info("event-collector listening", zap.String("port", cfg.Port))
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal("listen failed", zap.Error(err))
	}
}
