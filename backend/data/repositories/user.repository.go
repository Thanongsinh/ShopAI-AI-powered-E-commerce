package repositories

import (
	"github.com/sk/shopai/backend/domain/entities"
	"gorm.io/gorm"
)

type UserRepository struct{ db *gorm.DB }

func NewUserRepository(db *gorm.DB) *UserRepository { return &UserRepository{db} }

func (r *UserRepository) FindByEmail(email string) (*entities.User, error) {
	var u entities.User
	if err := r.db.Where("email = ?", email).First(&u).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) FindByID(id uint) (*entities.User, error) {
	var u entities.User
	if err := r.db.First(&u, id).Error; err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepository) Create(u *entities.User) error { return r.db.Create(u).Error }

func (r *UserRepository) Save(u *entities.User) error { return r.db.Save(u).Error }
