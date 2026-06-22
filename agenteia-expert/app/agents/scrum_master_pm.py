from app.agents.base_agent import BaseAgent


class ScrumMasterProjectManager(BaseAgent):
    slug = "scrum-master-pm"
    role = "ScrumMasterProjectManager"
    prompt_file = "scrum_master_pm.md"

    def required_tools(self) -> frozenset[str]:
        return frozenset({"file", "meeting", "task"})
