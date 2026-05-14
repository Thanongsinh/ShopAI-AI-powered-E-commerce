package models

type CartItemRequest struct {
	ProductID uint `json:"product_id"`
	Qty       int  `json:"qty"`
}

type CheckoutRequest struct {
	Address       string `json:"address"`
	PaymentMethod string `json:"payment_method"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}
