package services

import (
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
	"github.com/sk/shopai/backend/domain/models"
)

type ProductService struct {
	products *repositories.ProductRepository
}

func NewProductService(p *repositories.ProductRepository) *ProductService {
	return &ProductService{p}
}

func (s *ProductService) List(f models.ProductFilter) ([]entities.Product, int64, error) {
	return s.products.List(f)
}

func (s *ProductService) Get(id uint) (*entities.Product, error) {
	p, err := s.products.FindByID(id)
	if err != nil {
		return nil, err
	}
	_ = s.products.IncrementView(id)
	return p, nil
}

func (s *ProductService) Similar(id uint) ([]entities.Product, error) {
	return s.products.SimilarByCategory(id, 8)
}

func (s *ProductService) Trending() ([]entities.Product, error) {
	return s.products.Trending(12)
}

func (s *ProductService) ByShop(shopID uint) ([]entities.Product, error) {
	return s.products.ByShop(shopID)
}

func (s *ProductService) Save(p *entities.Product) error { return s.products.Save(p) }
func (s *ProductService) Delete(id uint) error           { return s.products.Delete(id) }
