# ShopAI

AI-powered E-commerce Platform — แนะนำสินค้าแบบ personalized

## Stack
- **Web**: React 19 + React Router 7 + TanStack Query + Zustand + Tailwind CSS
- **Backend**: Go / Fiber + PostgreSQL + Redis + MinIO + GORM
- **ML**: Python / FastAPI + scikit-learn (Collaborative Filtering)
- **Mobile**: Flutter 3 + Riverpod + GoRouter
- **Infra**: Docker Compose → K3s

## Services
| Service | Port | Description |
|---|---|---|
| backend | 8080 | Main API (Go/Fiber) |
| ml-service | 8001 | AI Recommendations (Python) |
| event-collector | 8002 | Behavior tracking (Go) |
| web | 3000 | React 19 frontend |

## Quick start

```bash
# 1. Start infra (Postgres, Redis, MinIO)
make infra-up

# 2. Backend
cp backend/config.yaml.example backend/config.yaml
cp backend/.env.example backend/.env
cd backend && go mod tidy && go run main.go

# 3. Web (separate terminal)
cd web && pnpm install && pnpm dev

# Open http://localhost:3000
```

Or all-in-one:

```bash
make infra-up && make dev
```

## Project structure

```
shopai/
├── backend/           Go/Fiber API + GORM + PostgreSQL
├── ml-service/        Python ML (collaborative filtering)
├── event-collector/   Go event ingestion
├── web/               React 19 (buyer + seller web)
└── mobile/            Flutter (buyer + seller app)
```

## Design

UI/UX implements the prototype delivered via Claude Design — see
`CLAUDE.MD` for the full design system, color palette, typography, and
component specs. The web app honours the design tokens through Tailwind +
CSS variables, with a runtime tweaks panel to swap palette / density.
