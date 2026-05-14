package services

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/sk/shopai/backend/data/repositories"
	"github.com/sk/shopai/backend/domain/entities"
)

// RecommendationService talks to the Python ml-service over HTTP and falls
// back to a DB query when ML is unavailable so the buyer UI never breaks.
type RecommendationService struct {
	products *repositories.ProductRepository
	mlURL    string
	client   *http.Client
}

func NewRecommendationService(p *repositories.ProductRepository, mlURL string) *RecommendationService {
	return &RecommendationService{p, mlURL, &http.Client{Timeout: 2 * time.Second}}
}

type mlResponse struct {
	ProductIDs []int64 `json:"product_ids"`
}

func (s *RecommendationService) Popular() ([]entities.Product, error) {
	ids, err := s.callML(context.Background(), "/popular")
	if err == nil && len(ids) > 0 {
		return s.fetchByIDs(ids)
	}
	return s.products.AIRecommended(10)
}

func (s *RecommendationService) ForUser(userID uint) ([]entities.Product, error) {
	if userID == 0 {
		return s.Popular()
	}
	ids, err := s.callML(context.Background(), "/recommend/"+strconv.FormatUint(uint64(userID), 10))
	if err == nil && len(ids) > 0 {
		return s.fetchByIDs(ids)
	}
	return s.products.AIRecommended(10)
}

func (s *RecommendationService) Similar(productID uint) ([]entities.Product, error) {
	ids, err := s.callML(context.Background(), "/similar/"+strconv.FormatUint(uint64(productID), 10))
	if err == nil && len(ids) > 0 {
		return s.fetchByIDs(ids)
	}
	return s.products.SimilarByCategory(productID, 8)
}

func (s *RecommendationService) callML(ctx context.Context, path string) ([]int64, error) {
	if s.mlURL == "" {
		return nil, http.ErrNoLocation
	}
	cctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(cctx, http.MethodGet, s.mlURL+path, nil)
	if err != nil {
		return nil, err
	}
	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return nil, http.ErrNoLocation
	}
	var body mlResponse
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, err
	}
	return body.ProductIDs, nil
}

// fetchByIDs preserves the order returned by ML — order is the recommendation rank.
func (s *RecommendationService) fetchByIDs(ids []int64) ([]entities.Product, error) {
	out := make([]entities.Product, 0, len(ids))
	for _, id := range ids {
		p, err := s.products.FindByID(uint(id))
		if err != nil || p.Status != "active" {
			continue
		}
		out = append(out, *p)
	}
	return out, nil
}
