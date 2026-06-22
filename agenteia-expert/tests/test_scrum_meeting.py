import pytest

from app.services.meeting_service import MeetingService


@pytest.mark.asyncio
async def test_meeting_runs_agents_sequentially() -> None:
    calls: list[str] = []

    async def invoke(prompt: str) -> str:
        calls.append(prompt)
        return f"response-{len(calls)}"

    responses = await MeetingService(invoke).run_sequential(
        ["fullstack", "devops", "scrum"], "initial context"
    )

    assert responses == ["response-1", "response-2", "response-3"]
    assert "response-1" in calls[1]
    assert "response-2" in calls[2]
