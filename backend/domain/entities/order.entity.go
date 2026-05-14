package entities

import "time"

type Order struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	BuyerID       uint       `gorm:"index" json:"buyer_id"`
	Total         float64    `gorm:"not null" json:"total"`
	Status        string     `gorm:"size:20;default:pending" json:"status"` // pending|paid|shipping|delivered|cancelled
	Address       string     `gorm:"type:text" json:"address"`
	PaymentMethod string     `gorm:"size:32" json:"payment_method"`
	PaidAt        *time.Time `json:"paid_at"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`

	Items []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	OrderID   uint    `gorm:"index" json:"order_id"`
	ProductID uint    `gorm:"index" json:"product_id"`
	ShopID    uint    `gorm:"index" json:"shop_id"`
	Qty       int     `gorm:"not null" json:"qty"`
	Price     float64 `gorm:"not null" json:"price"`
}
