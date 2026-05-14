package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type CategoryRepository struct{ db *gorm.DB }

func NewCategoryRepository(db *gorm.DB) *CategoryRepository { return &CategoryRepository{db} }

func (r *CategoryRepository) All() ([]entities.Category, error) {
	var items []entities.Category
	err := r.db.Order("id asc").Find(&items).Error
	return items, err
}
