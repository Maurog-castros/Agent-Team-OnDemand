from app.agents.base_agent import BaseAgent


class DesarrolladorFullStack(BaseAgent):
    slug = "desarrollador-fullstack"
    role = "DesarrolladorFullStack"
    prompt_file = "desarrollador_fullstack.md"

    def required_tools(self) -> frozenset[str]:
        return frozenset({"file", "git"})
