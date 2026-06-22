from app.agents.base_agent import BaseAgent


class AgenteIAExpert(BaseAgent):
    slug = "agenteia-expert"
    role = "RootAgent"
    prompt_file = "agenteia_expert.md"

    def required_tools(self) -> frozenset[str]:
        return frozenset({"file", "git", "meeting", "task"})
