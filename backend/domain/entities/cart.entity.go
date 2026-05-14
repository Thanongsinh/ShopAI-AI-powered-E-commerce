package entities

import "time"

type Cart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	ProductID uint      `gorm:"index" json:"product_id"`
	Qty       int       `gorm:"default:1" json:"qty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Wishlist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	ProductID uint      `gorm:"index" json:"product_id"`
	CreatedAt time.Time `json:"created_at"`
}
