package entities

import "time"

type Shop struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index" json:"user_id"`
	Name        string    `gorm:"size:160;not null" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Logo        string    `gorm:"size:255" json:"logo"`
	Rating      float64   `gorm:"default:0" json:"rating"`
	TotalSales  int       `gorm:"default:0" json:"total_sales"`
	IsVerified  bool      `gorm:"default:false" json:"is_verified"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
