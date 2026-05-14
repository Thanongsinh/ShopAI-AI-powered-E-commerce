package services

import (
	"errors"

	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
)

type CartService struct {
	carts    *repositories.CartRepository
	products *repositories.ProductRepository
	orders   *repositories.OrderRepository
}

func NewCartService(c *repositories.CartRepository, p *repositories.ProductRepository, o *repositories.OrderRepository) *CartService {
	return &CartService{c, p, o}
}

type CartLine struct {
	entities.Cart
	Product *entities.Product `json:"product"`
}

func (s *CartService) List(userID uint) ([]CartLine, error) {
	items, err := s.carts.List(userID)
	if err != nil {
		return nil, err
	}
	out := make([]CartLine, 0, len(items))
	for _, i := range items {
		p, _ := s.products.FindByID(i.ProductID)
		out = append(out, CartLine{Cart: i, Product: p})
	}
	return out, nil
}

func (s *CartService) Upsert(userID uint, req models.CartItemRequest) error {
	if req.Qty <= 0 {
		req.Qty = 1
	}
	return s.carts.Upsert(userID, req.ProductID, req.Qty)
}

func (s *CartService) Remove(userID, productID uint) error {
	return s.carts.Delete(userID, productID)
}

func (s *CartService) Checkout(userID uint, req models.CheckoutRequest) (*entities.Order, error) {
	items, err := s.carts.List(userID)
	if err != nil {
		return nil, err
	}
	if len(items) == 0 {
		return nil, errors.New("cart is empty")
	}
	order := &entities.Order{
		BuyerID:       userID,
		Address:       req.Address,
		PaymentMethod: req.PaymentMethod,
		Status:        "pending",
	}
	var total float64
	for _, i := range items {
		p, err := s.products.FindByID(i.ProductID)
		if err != nil {
			continue
		}
		order.Items = append(order.Items, entities.OrderItem{
			ProductID: p.ID, ShopID: p.ShopID, Qty: i.Qty, Price: p.Price,
		})
		total += p.Price * float64(i.Qty)
	}
	order.Total = total
	if err := s.orders.Create(order); err != nil {
		return nil, err
	}
	_ = s.carts.Clear(userID)
	return order, nil
}
