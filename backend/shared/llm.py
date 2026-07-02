"""
Shared LLM provider detection.
All backend modules import get_llm_model from here.
No module may call pydantic-ai directly with its own provider logic.
"""
import os
from backend.shared.config import settings


def get_llm_model():
    """
    Auto-detect the available LLM provider from environment variables.
    Returns a PydanticAI model string or a TestModel for local dev.
    Priority: Gemini → OpenAI → Anthropic → Groq → Mock (TestModel)
    """
    from pydantic_ai.models.test import TestModel

    provider, model_name = settings.get_provider_and_model()

    if provider == "gemini" and settings.gemini_api_key:
        os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
        return f"gemini:{model_name}"
    if provider == "openai" and settings.openai_api_key:
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key
        return f"openai:{model_name}"
    if provider == "anthropic" and settings.anthropic_api_key:
        os.environ["ANTHROPIC_API_KEY"] = settings.anthropic_api_key
        return f"anthropic:{model_name}"
    if provider == "groq" and settings.groq_api_key:
        os.environ["GROQ_API_KEY"] = settings.groq_api_key
        return f"groq:{model_name}"

    return TestModel()
