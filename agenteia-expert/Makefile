.PHONY: install test lint format run up down logs

install:
	python -m pip install -e ".[dev]"

test:
	pytest

lint:
	ruff check .

format:
	ruff format .

run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8080

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f api
