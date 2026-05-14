package entities

import (
	"time"

	"github.com/lib/pq"
)

type Product struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	ShopID          uint           `gorm:"index" json:"shop_id"`
	CategoryID      uint           `gorm:"index" json:"category_id"`
	CategorySlug    string         `gorm:"size:60;index" json:"category_slug"`
	Name            string         `gorm:"size:255;not null" json:"name"`
	Description     string         `gorm:"type:text" json:"description"`
	Price           float64        `gorm:"not null" json:"price"`
	OriginalPrice   float64        `gorm:"default:0" json:"original_price"`
	Discount        int            `gorm:"default:0" json:"discount"`
	Stock           int            `gorm:"default:0" json:"stock"`
	Images          pq.StringArray `gorm:"type:text[]" json:"images"`
	Colors          pq.StringArray `gorm:"type:text[]" json:"colors"`
	Sizes           pq.StringArray `gorm:"type:text[]" json:"sizes"`
	Specs           string         `gorm:"type:text" json:"specs"` // JSON-encoded [[key,value]]
	Icon            string         `gorm:"size:16" json:"icon"`
	ColorFrom       string         `gorm:"size:24" json:"color_from"`
	ColorTo         string         `gorm:"size:24" json:"color_to"`
	Status          string         `gorm:"size:20;default:active" json:"status"` // active | inactive | sold_out
	SoldCount       int            `gorm:"default:0" json:"sold"`
	ViewCount       int            `gorm:"default:0" json:"views"`
	Rating          float64        `gorm:"default:0" json:"rating"`
	ReviewCount     int            `gorm:"default:0" json:"reviews"`
	IsAIRecommended bool           `gorm:"default:false;index" json:"is_ai_recommended"`
	IsNew           bool           `gorm:"default:false" json:"is_new"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
}
