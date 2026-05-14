package bootstrap

import (
	"fmt"

	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewDatabase(cfg DatabaseConfig) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
		cfg.Host, cfg.Port, cfg.User, cfg.Password, cfg.Name, cfg.SSLMode,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&entities.User{},
		&entities.Shop{},
		&entities.Category{},
		&entities.Product{},
		&entities.Order{},
		&entities.OrderItem{},
		&entities.Cart{},
		&entities.Review{},
		&entities.Behavior{},
		&entities.Wishlist{},
		&entities.RecommendationCache{},
	); err != nil {
		return nil, err
	}
	return db, nil
}
