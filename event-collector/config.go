package main

import "os"

type Config struct {
	Port            string
	RedisAddr       string
	DatabaseURL     string
	MLServiceURL    string
	BatchSize       int
	FlushIntervalS  int
	RetrainAtCount  int
	QueueKey        string
	CounterKey      string
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func LoadConfig() Config {
	return Config{
		Port:           envOr("PORT", "8002"),
		RedisAddr:      envOr("REDIS_ADDR", "localhost:6379"),
		DatabaseURL:    envOr("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/shopai_db?sslmode=disable"),
		MLServiceURL:   envOr("ML_SERVICE_URL", "http://localhost:8001"),
		BatchSize:      200,
		FlushIntervalS: 30,
		RetrainAtCount: 100,
		QueueKey:       "shopai:events:queue",
		CounterKey:     "shopai:events:since_retrain",
	}
}
