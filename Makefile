.PHONY: help install dev build test clean docker-up docker-down backend-test frontend-lint

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "Installing frontend dependencies..."
	pnpm install
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Done!"

dev: ## Run development servers (frontend and backend)
	@echo "Starting development servers..."
	@make -j2 dev-frontend dev-backend

dev-frontend: ## Run frontend development server
	pnpm dev

dev-backend: ## Run backend development server
	cd backend && python main.py

build: ## Build frontend for production
	pnpm build

test: ## Run all tests
	@make backend-test
	@make frontend-lint

backend-test: ## Run backend tests
	cd backend && pytest test_main.py -v

frontend-lint: ## Lint frontend code
	pnpm lint

clean: ## Clean build artifacts and dependencies
	rm -rf .next
	rm -rf node_modules
	rm -rf backend/__pycache__
	rm -rf backend/.pytest_cache
	rm -rf backend/venv

docker-up: ## Start all services with Docker Compose
	docker-compose up -d

docker-down: ## Stop all Docker services
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

docker-rebuild: ## Rebuild and restart Docker services
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

setup-env: ## Create environment files from examples
	@if [ ! -f .env.local ]; then \
		cp .env.local.example .env.local; \
		echo "Created .env.local - please edit with your credentials"; \
	fi
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "Created backend/.env"; \
	fi

deploy-backend: ## Deploy backend to Railway
	cd backend && railway up

deploy-frontend: ## Deploy frontend to Vercel
	vercel --prod

format: ## Format code
	@echo "Formatting Python code..."
	cd backend && black main.py test_main.py || echo "black not installed"
	@echo "Formatting TypeScript code..."
	pnpm prettier --write . || echo "prettier not configured"
