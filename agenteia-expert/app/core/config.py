from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AgenteIA Expert"
    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8080
    log_level: str = "INFO"
    database_url: str = "sqlite+aiosqlite:///./agenteia.db"
    redis_url: str = "redis://localhost:6379/0"
    timezone: str = "America/Santiago"
    workspace_root: Path = Path("workspaces")
    llm_provider: str = "openai_compatible"
    llm_base_url: str = "https://ia.iamiko.cl/v1"
    llm_api_key: SecretStr = SecretStr("")
    default_model: str = "auto-hermes"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
