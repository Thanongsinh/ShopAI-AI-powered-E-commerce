package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type ReviewRepository struct{ db *gorm.DB }

func NewReviewRepository(db *gorm.DB) *ReviewRepository { return &ReviewRepository{db} }

func (r *ReviewRepository) ByProduct(productID uint) ([]entities.Review, error) {
	var items []entities.Review
	err := r.db.Where("product_id = ?", productID).Order("created_at desc").Find(&items).Error
	return items, err
}
