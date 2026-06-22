from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path


class BaseAgent(ABC):
    slug: str
    role: str
    prompt_file: str

    @abstractmethod
    def required_tools(self) -> frozenset[str]:
        raise NotImplementedError

    def load_prompt(self, prompt_root: Path) -> str:
        return (prompt_root / self.prompt_file).read_text(encoding="utf-8")
