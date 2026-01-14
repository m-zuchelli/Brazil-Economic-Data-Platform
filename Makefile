.PHONY: dev test lint

dev:
	docker compose up --build

test:
	cd backend && poetry install && poetry run pytest

lint:
	cd backend && poetry install && poetry run ruff check . && poetry run ruff format --check .
