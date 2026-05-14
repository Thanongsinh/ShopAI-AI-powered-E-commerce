package repositories

import (
	"strings"

	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
	"gorm.io/gorm"
)

type ProductRepository struct{ db *gorm.DB }

func NewProductRepository(db *gorm.DB) *ProductRepository { return &ProductRepository{db} }

func (r *ProductRepository) List(f models.ProductFilter) ([]entities.Product, int64, error) {
	q := r.db.Model(&entities.Product{}).Where("status = ?", "active")
	if f.CategorySlug != "" && f.CategorySlug != "all" {
		q = q.Where("category_slug = ?", f.CategorySlug)
	}
	if f.Q != "" {
		q = q.Where("LOWER(name) LIKE ?", "%"+strings.ToLower(f.Q)+"%")
	}
	if f.MinPrice > 0 {
		q = q.Where("price >= ?", f.MinPrice)
	}
	if f.MaxPrice > 0 {
		q = q.Where("price <= ?", f.MaxPrice)
	}
	if f.OnlyAI {
		q = q.Where("is_ai_recommended = ?", true)
	}

	switch f.Sort {
	case "price_asc":
		q = q.Order("price asc")
	case "price_desc":
		q = q.Order("price desc")
	case "newest":
		q = q.Order("created_at desc")
	case "rating":
		q = q.Order("rating desc")
	default:
		q = q.Order("sold_count desc")
	}

	var total int64
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var items []entities.Product
	if err := q.Offset((f.Page - 1) * f.Limit).Limit(f.Limit).Find(&items).Error; err != nil {
		return nil, 0, err
	}
	return items, total, nil
}

func (r *ProductRepository) FindByID(id uint) (*entities.Product, error) {
	var p entities.Product
	if err := r.db.First(&p, id).Error; err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *ProductRepository) IncrementView(id uint) error {
	return r.db.Model(&entities.Product{}).Where("id = ?", id).
		UpdateColumn("view_count", gorm.Expr("view_count + 1")).Error
}

func (r *ProductRepository) Trending(limit int) ([]entities.Product, error) {
	var items []entities.Product
	err := r.db.Where("status = ?", "active").Order("sold_count desc").Limit(limit).Find(&items).Error
	return items, err
}

func (r *ProductRepository) AIRecommended(limit int) ([]entities.Product, error) {
	var items []entities.Product
	err := r.db.Where("status = ? AND is_ai_recommended = ?", "active", true).
		Order("rating desc").Limit(limit).Find(&items).Error
	return items, err
}

func (r *ProductRepository) SimilarByCategory(id uint, limit int) ([]entities.Product, error) {
	var ref entities.Product
	if err := r.db.First(&ref, id).Error; err != nil {
		return nil, err
	}
	var items []entities.Product
	err := r.db.Where("category_slug = ? AND id <> ? AND status = ?", ref.CategorySlug, id, "active").
		Order("rating desc").Limit(limit).Find(&items).Error
	return items, err
}

func (r *ProductRepository) Save(p *entities.Product) error {
	return r.db.Save(p).Error
}

func (r *ProductRepository) Delete(id uint) error {
	return r.db.Delete(&entities.Product{}, id).Error
}

func (r *ProductRepository) ByShop(shopID uint) ([]entities.Product, error) {
	var items []entities.Product
	err := r.db.Where("shop_id = ?", shopID).Order("created_at desc").Find(&items).Error
	return items, err
}
