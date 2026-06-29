"""Portal estático + reverse proxy /api → API de producción (SSE-compatible)."""

from __future__ import annotations

import os
from pathlib import Path

import httpx
from starlette.applications import Starlette
from starlette.exceptions import HTTPException
from starlette.requests import Request
from starlette.responses import Response, StreamingResponse
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "frontend" / "dist"
API_URL = os.getenv("PORTAL_API_URL", "http://127.0.0.1:8092").rstrip("/")

HOP_BY_HOP = {
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailers",
    "transfer-encoding",
    "upgrade",
}


def _forward_headers(request: Request) -> dict[str, str]:
    return {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in HOP_BY_HOP and key.lower() != "host"
    }


def _response_headers(headers: httpx.Headers) -> dict[str, str]:
    return {
        key: value
        for key, value in headers.items()
        if key.lower() not in HOP_BY_HOP
    }


async def proxy_api(request: Request) -> Response:
    path = request.path_params.get("path", "")
    target = f"{API_URL}/{path}"
    if request.url.query:
        target = f"{target}?{request.url.query}"

    client = httpx.AsyncClient(timeout=None)
    try:
        upstream = await client.send(
            client.build_request(
                request.method,
                target,
                headers=_forward_headers(request),
                content=await request.body(),
            ),
            stream=True,
        )
    except httpx.RequestError as exc:
        await client.aclose()
        return Response(f"API unreachable: {exc}", status_code=502)

    async def stream() -> None:
        try:
            async for chunk in upstream.aiter_raw():
                yield chunk
        finally:
            await upstream.aclose()
            await client.aclose()

    return StreamingResponse(
        stream(),
        status_code=upstream.status_code,
        headers=_response_headers(upstream.headers),
        media_type=upstream.headers.get("content-type"),
    )


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        try:
            return await super().get_response(path, scope)
        except HTTPException as exc:
            if exc.status_code == 404:
                return await super().get_response("index.html", scope)
            raise


routes: list[Route | Mount] = [
    Route("/api/{path:path}", proxy_api, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]),
]

if DIST.is_dir():
    routes.append(Mount("/", SPAStaticFiles(directory=str(DIST), html=True), name="static"))

app = Starlette(routes=routes)
