FROM python:3.11-slim AS builder

WORKDIR /build
ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

COPY pyproject.toml README.md ./
COPY app ./app
RUN python -m pip install --upgrade pip build \
    && python -m build --wheel

FROM python:3.11-slim AS runtime

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN useradd --create-home --uid 10001 appuser
COPY --from=builder /build/dist/*.whl /tmp/
RUN python -m pip install --no-cache-dir /tmp/*.whl \
    && rm -f /tmp/*.whl
COPY alembic.ini ./
COPY app/db/migrations ./app/db/migrations
COPY scripts ./scripts
COPY workspaces ./workspaces
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8080
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
