from app.agents.base_agent import BaseAgent


class DevOpsArquitectoSoluciones(BaseAgent):
    slug = "devops-arquitecto"
    role = "DevOpsArquitectoSoluciones"
    prompt_file = "devops_arquitecto.md"

    def required_tools(self) -> frozenset[str]:
        return frozenset({"file", "git", "docker"})
