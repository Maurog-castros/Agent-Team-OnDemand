from pathlib import Path

import pytest

from app.services.workspace_service import WorkspaceService


def test_creates_personal_workspace(tmp_path: Path) -> None:
    workspace = WorkspaceService(tmp_path).create_agent_workspace("agenteia-expert")

    assert workspace == tmp_path / "agents" / "agenteia-expert"
    assert (workspace / "memory.md").exists()
    assert (workspace / "artifacts").is_dir()


def test_rejects_unsafe_workspace_slug(tmp_path: Path) -> None:
    with pytest.raises(ValueError, match="unsupported"):
        WorkspaceService(tmp_path).create_agent_workspace("../escape")
