package entities

import "time"

type Review struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `gorm:"index" json:"product_id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	UserName  string    `gorm:"size:120" json:"user"`
	Avatar    string    `gorm:"size:4" json:"avatar"`
	Rating    int       `json:"rating"`
	Text      string    `gorm:"type:text" json:"text"`
	HasImage  bool      `json:"has_img"`
	CreatedAt time.Time `json:"created_at"`
}
