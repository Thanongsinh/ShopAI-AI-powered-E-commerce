package services

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/sk/shopai/backend/domain/models"
)

// EventService forwards behavior events to the event-collector service.
// We do not insert directly into the DB any more — the collector batches
// inserts to keep request latency stable and to centralize retrain triggers.
type EventService struct {
	collectorURL string
	client       *http.Client
}

func NewEventService(collectorURL string) *EventService {
	return &EventService{
		collectorURL: collectorURL,
		client:       &http.Client{Timeout: 2 * time.Second},
	}
}

var weights = map[string]float64{"view": 1, "wishlist": 2, "add_cart": 3, "purchase": 5}

func (s *EventService) Track(ctx context.Context, req models.EventRequest) error {
	if _, ok := weights[req.Action]; !ok {
		return errors.New("invalid action")
	}
	if req.SessionID == "" && req.UserID == nil {
		return errors.New("session_id or user_id required")
	}
	if req.ProductID == 0 {
		return errors.New("product_id required")
	}
	body, err := json.Marshal(req)
	if err != nil {
		return err
	}
	r, err := http.NewRequestWithContext(ctx, http.MethodPost, s.collectorURL+"/events", bytes.NewReader(body))
	if err != nil {
		return err
	}
	r.Header.Set("Content-Type", "application/json")
	resp, err := s.client.Do(r)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return errors.New("event-collector returned " + resp.Status)
	}
	return nil
}
