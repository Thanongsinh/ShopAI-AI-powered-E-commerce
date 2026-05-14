package models

type ProductFilter struct {
	CategorySlug string
	Q            string
	MinPrice     float64
	MaxPrice     float64
	Sort         string // popular | price_asc | price_desc | newest | rating
	OnlyAI       bool
	Page         int
	Limit        int
}

type EventRequest struct {
	UserID    *uint  `json:"user_id"`
	SessionID string `json:"session_id"`
	ProductID uint   `json:"product_id"`
	Action    string `json:"action"`
}
