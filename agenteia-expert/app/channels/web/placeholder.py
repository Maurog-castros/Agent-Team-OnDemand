from fastapi import APIRouter

router = APIRouter(prefix="/portal", tags=["portal"])


@router.get("")
async def portal_status() -> dict[str, str]:
    return {
        "status": "ready",
        "message": "Portal React disponible en el servicio frontend (nginx).",
        "ui": "Servir / desde el contenedor portal o Vite en desarrollo.",
    }
