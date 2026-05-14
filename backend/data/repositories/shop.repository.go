package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type ShopRepository struct{ db *gorm.DB }

func NewShopRepository(db *gorm.DB) *ShopRepository { return &ShopRepository{db} }

func (r *ShopRepository) ByUserID(userID uint) (*entities.Shop, error) {
	var s entities.Shop
	if err := r.db.Where("user_id = ?", userID).First(&s).Error; err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *ShopRepository) Save(s *entities.Shop) error { return r.db.Save(s).Error }

func (r *ShopRepository) Create(s *entities.Shop) error { return r.db.Create(s).Error }
