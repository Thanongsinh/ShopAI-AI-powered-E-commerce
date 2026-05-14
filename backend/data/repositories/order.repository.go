package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type OrderRepository struct{ db *gorm.DB }

func NewOrderRepository(db *gorm.DB) *OrderRepository { return &OrderRepository{db} }

func (r *OrderRepository) Create(o *entities.Order) error { return r.db.Create(o).Error }

func (r *OrderRepository) ListByBuyer(userID uint) ([]entities.Order, error) {
	var items []entities.Order
	err := r.db.Preload("Items").Where("buyer_id = ?", userID).Order("created_at desc").Find(&items).Error
	return items, err
}

func (r *OrderRepository) ListByShop(shopID uint) ([]entities.Order, error) {
	var items []entities.Order
	err := r.db.Preload("Items").
		Joins("JOIN order_items oi ON oi.order_id = orders.id").
		Where("oi.shop_id = ?", shopID).Distinct().
		Order("orders.created_at desc").Find(&items).Error
	return items, err
}

func (r *OrderRepository) FindByID(id uint) (*entities.Order, error) {
	var o entities.Order
	if err := r.db.Preload("Items").First(&o, id).Error; err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *OrderRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&entities.Order{}).Where("id = ?", id).Update("status", status).Error
}
