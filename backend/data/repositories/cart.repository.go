package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type CartRepository struct{ db *gorm.DB }

func NewCartRepository(db *gorm.DB) *CartRepository { return &CartRepository{db} }

func (r *CartRepository) List(userID uint) ([]entities.Cart, error) {
	var items []entities.Cart
	err := r.db.Where("user_id = ?", userID).Find(&items).Error
	return items, err
}

func (r *CartRepository) Upsert(userID, productID uint, qty int) error {
	var existing entities.Cart
	err := r.db.Where("user_id = ? AND product_id = ?", userID, productID).First(&existing).Error
	if err == gorm.ErrRecordNotFound {
		return r.db.Create(&entities.Cart{UserID: userID, ProductID: productID, Qty: qty}).Error
	}
	if err != nil {
		return err
	}
	existing.Qty = qty
	return r.db.Save(&existing).Error
}

func (r *CartRepository) Delete(userID, productID uint) error {
	return r.db.Where("user_id = ? AND product_id = ?", userID, productID).Delete(&entities.Cart{}).Error
}

func (r *CartRepository) Clear(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&entities.Cart{}).Error
}
