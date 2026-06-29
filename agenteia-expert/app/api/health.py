from fastapi import APIRouter

from app.api.deps import build_health_service
from app.db.session import SessionDependency
from app.services.health_service import HealthDepsResponse

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/health/deps", response_model=HealthDepsResponse)
async def health_deps(session: SessionDependency) -> HealthDepsResponse:
    return await build_health_service().get_deps(session)
