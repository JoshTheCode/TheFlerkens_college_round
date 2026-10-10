import json
import os
import re
from typing import Any, Dict, List, Optional
import httpx
from agents.models import AttackFamily, AttackPlan, Severity, TargetProfile


class ModelClient:
    """Configurable client for OpenAI-compatible/OpenRouter model providers with fallback doubles."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: float = 15.0,
    ):
        self.base_url = (base_url or os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")).rstrip("/")
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")
        self.model = model or os.getenv("AGENTBREAK_MODEL", "openai/gpt-4o-mini")
        self.timeout_seconds = float(os.getenv("AGENTBREAK_MODEL_TIMEOUT_SECONDS", str(timeout_seconds)))

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key.strip())

    def call_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        tools: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Execute a chat completion request against the provider or raise on provider error."""
        if not self.is_configured:
            raise RuntimeError("ModelClient not configured: OPENAI_API_KEY is not set.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/JoshTheCode/TheFlerkens_college_round",
            "X-Title": "AgentBreak Autonomous AI Red Team",
        }

        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"

        with httpx.Client(timeout=self.timeout_seconds) as client:
            resp = client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
            )
            if resp.status_code != 200:
                raise RuntimeError(
                    f"Model provider returned error HTTP {resp.status_code}: {resp.text[:200]}"
                )
            return resp.json()
