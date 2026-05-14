package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type WishlistRepository struct{ db *gorm.DB }

func NewWishlistRepository(db *gorm.DB) *WishlistRepository { return &WishlistRepository{db} }

func (r *WishlistRepository) List(userID uint) ([]entities.Wishlist, error) {
	var items []entities.Wishlist
	err := r.db.Where("user_id = ?", userID).Find(&items).Error
	return items, err
}

func (r *WishlistRepository) Add(userID, productID uint) error {
	return r.db.FirstOrCreate(&entities.Wishlist{}, entities.Wishlist{UserID: userID, ProductID: productID}).Error
}

func (r *WishlistRepository) Remove(userID, productID uint) error {
	return r.db.Where("user_id = ? AND product_id = ?", userID, productID).Delete(&entities.Wishlist{}).Error
}
