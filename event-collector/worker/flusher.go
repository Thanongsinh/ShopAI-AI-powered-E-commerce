package worker

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"github.com/sk/shopai/event-collector/handlers"
)

type Flusher struct {
	rdb            *redis.Client
	db             *sql.DB
	log            *zap.Logger
	queueKey       string
	counterKey     string
	batchSize      int
	interval       time.Duration
	retrainAt      int
	mlServiceURL   string
}

type Options struct {
	QueueKey     string
	CounterKey   string
	BatchSize    int
	Interval     time.Duration
	RetrainAt    int
	MLServiceURL string
}

func New(rdb *redis.Client, db *sql.DB, log *zap.Logger, o Options) *Flusher {
	return &Flusher{
		rdb: rdb, db: db, log: log,
		queueKey: o.QueueKey, counterKey: o.CounterKey,
		batchSize: o.BatchSize, interval: o.Interval,
		retrainAt: o.RetrainAt, mlServiceURL: o.MLServiceURL,
	}
}

// Run blocks until ctx is cancelled, flushing at most batchSize events per tick.
func (f *Flusher) Run(ctx context.Context) {
	t := time.NewTicker(f.interval)
	defer t.Stop()
	for {
		select {
		case <-ctx.Done():
			f.flushOnce(context.Background()) // best-effort drain
			return
		case <-t.C:
			f.flushOnce(ctx)
		}
	}
}

func (f *Flusher) flushOnce(ctx context.Context) {
	events, err := f.popBatch(ctx)
	if err != nil {
		f.log.Warn("popBatch failed", zap.Error(err))
		return
	}
	if len(events) == 0 {
		return
	}
	if err := f.insert(ctx, events); err != nil {
		f.log.Error("batch insert failed; events lost", zap.Int("dropped", len(events)), zap.Error(err))
		return
	}
	f.log.Info("flushed events", zap.Int("count", len(events)))

	count, _ := f.rdb.IncrBy(ctx, f.counterKey, int64(len(events))).Result()
	if int(count) >= f.retrainAt {
		f.triggerRetrain(ctx)
		f.rdb.Set(ctx, f.counterKey, 0, 0)
	}
}

func (f *Flusher) popBatch(ctx context.Context) ([]handlers.BehaviorEvent, error) {
	out := make([]handlers.BehaviorEvent, 0, f.batchSize)
	for i := 0; i < f.batchSize; i++ {
		raw, err := f.rdb.LPop(ctx, f.queueKey).Result()
		if err == redis.Nil {
			break
		}
		if err != nil {
			return out, err
		}
		var ev handlers.BehaviorEvent
		if jerr := json.Unmarshal([]byte(raw), &ev); jerr != nil {
			f.log.Warn("drop malformed event", zap.Error(jerr))
			continue
		}
		out = append(out, ev)
	}
	return out, nil
}

func (f *Flusher) insert(ctx context.Context, events []handlers.BehaviorEvent) error {
	// Single multi-row INSERT with parameterized placeholders to avoid SQL injection.
	var b strings.Builder
	b.WriteString("INSERT INTO behaviors (user_id, session_id, product_id, action, weight, created_at) VALUES ")
	args := make([]interface{}, 0, len(events)*6)
	for i, ev := range events {
		if i > 0 {
			b.WriteString(",")
		}
		base := i * 6
		b.WriteString("($" + strconv.Itoa(base+1) + ",$" + strconv.Itoa(base+2) + ",$" + strconv.Itoa(base+3) + ",$" + strconv.Itoa(base+4) + ",$" + strconv.Itoa(base+5) + ",$" + strconv.Itoa(base+6) + ")")
		args = append(args, ev.UserID, ev.SessionID, ev.ProductID, ev.Action, ev.Weight(), ev.CreatedAt)
	}
	cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	_, err := f.db.ExecContext(cctx, b.String(), args...)
	return err
}

func (f *Flusher) triggerRetrain(ctx context.Context) {
	if f.mlServiceURL == "" {
		return
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, f.mlServiceURL+"/train", nil)
	if err != nil {
		return
	}
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		f.log.Warn("retrain trigger failed", zap.Error(err))
		return
	}
	defer resp.Body.Close()
	f.log.Info("retrain triggered", zap.Int("status", resp.StatusCode))
}
