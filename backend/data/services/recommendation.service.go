package services

import (
	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
)

// RecommendationService is a stub. The real implementation will HTTP-call
// the Python ml-service. For now we return AI-flagged products from DB.
type RecommendationService struct {
	products *repositories.ProductRepository
	mlURL    string
}

func NewRecommendationService(p *repositories.ProductRepository, mlURL string) *RecommendationService {
	return &RecommendationService{p, mlURL}
}

func (s *RecommendationService) Popular() ([]entities.Product, error) {
	return s.products.AIRecommended(10)
}

func (s *RecommendationService) ForUser(_ uint) ([]entities.Product, error) {
	// TODO: HTTP GET {ml-service}/recommend/{user_id}
	return s.products.AIRecommended(10)
}

func (s *RecommendationService) Similar(productID uint) ([]entities.Product, error) {
	// TODO: HTTP GET {ml-service}/similar/{product_id}
	return s.products.SimilarByCategory(productID, 8)
}
