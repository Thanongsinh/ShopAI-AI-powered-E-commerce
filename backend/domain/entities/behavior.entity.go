package entities

import (
	"time"

	"github.com/lib/pq"
)

type Behavior struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    *uint     `gorm:"index" json:"user_id"`
	SessionID string    `gorm:"size:64;index" json:"session_id"`
	ProductID uint      `gorm:"index" json:"product_id"`
	Action    string    `gorm:"size:20" json:"action"` // view | add_cart | purchase | wishlist
	Weight    float64   `gorm:"default:0" json:"weight"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
}

type RecommendationCache struct {
	UserID     uint          `gorm:"primaryKey" json:"user_id"`
	ProductIDs pq.Int64Array `gorm:"type:integer[]" json:"product_ids"`
	UpdatedAt  time.Time     `json:"updated_at"`
}
