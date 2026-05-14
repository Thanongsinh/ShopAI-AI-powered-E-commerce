.PHONY: dev dev-backend dev-ml dev-events dev-web test lint infra-up infra-down build

dev: ## Start all services in parallel
	@$(MAKE) -j4 dev-backend dev-ml dev-events dev-web

dev-backend:
	cd backend && go run main.go

dev-ml:
	cd ml-service && uvicorn main:app --reload --port 8001

dev-events:
	cd event-collector && go run main.go

dev-web:
	cd web && pnpm dev

infra-up: ## Start Postgres, Redis, MinIO via docker compose
	docker compose up -d postgres redis minio

infra-down:
	docker compose down

build: ## Build all services into Docker images
	docker compose --profile app build

test:
	cd backend && go test ./...
	cd event-collector && go test ./...
	cd ml-service && pytest

lint:
	cd backend && go vet ./...
	cd web && pnpm lint
