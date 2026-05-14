package entities

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `gorm:"size:120;not null" json:"name"`
	Email        string    `gorm:"size:160;unique;not null" json:"email"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
	Role         string    `gorm:"size:20;default:buyer" json:"role"` // buyer | seller | admin
	Avatar       string    `gorm:"size:255" json:"avatar"`
	Phone        string    `gorm:"size:32" json:"phone"`
	IsSeller     bool      `gorm:"default:false" json:"is_seller"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
