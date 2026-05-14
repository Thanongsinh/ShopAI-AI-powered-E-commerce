package entities

import "time"

type Category struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Slug      string    `gorm:"size:60;unique;not null" json:"slug"`
	Name      string    `gorm:"size:80;not null" json:"name"`
	Icon      string    `gorm:"size:8" json:"icon"`
	Count     int       `gorm:"default:0" json:"count"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
