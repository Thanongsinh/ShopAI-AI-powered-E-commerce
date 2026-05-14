package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type BehaviorRepository struct{ db *gorm.DB }

func NewBehaviorRepository(db *gorm.DB) *BehaviorRepository { return &BehaviorRepository{db} }

func (r *BehaviorRepository) Track(b *entities.Behavior) error { return r.db.Create(b).Error }
