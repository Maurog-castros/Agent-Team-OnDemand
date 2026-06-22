from pathlib import Path

from app.agents import (
    AgenteIAExpert,
    DesarrolladorFullStack,
    DevOpsArquitectoSoluciones,
    ScrumMasterProjectManager,
)


def test_initial_agent_definitions_have_unique_slugs_and_tools() -> None:
    agents = [
        AgenteIAExpert(),
        DesarrolladorFullStack(),
        DevOpsArquitectoSoluciones(),
        ScrumMasterProjectManager(),
    ]

    assert len({agent.slug for agent in agents}) == 4
    assert all(agent.required_tools() for agent in agents)


def test_initial_agent_prompts_exist() -> None:
    prompt_root = Path(__file__).parents[1] / "app" / "prompts"
    assert "agente raíz" in AgenteIAExpert().load_prompt(prompt_root)
