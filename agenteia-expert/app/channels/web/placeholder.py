from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/portal", tags=["portal"])


@router.get("", include_in_schema=False)
async def portal_status() -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"status": "pending", "message": "Portal React pendiente de diseño aprobado."},
    )
