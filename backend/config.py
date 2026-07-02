import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Try to load .env from the current directory, parent directory or backend folder
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

class Settings(BaseSettings):
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    anthropic_api_key: str | None = os.getenv("ANTHROPIC_API_KEY")
    groq_api_key: str | None = os.getenv("GROQ_API_KEY")
    
    # Provider choice: 'gemini', 'openai', 'anthropic', 'groq', or 'mock'
    # If not specified, we will auto-detect based on available keys.
    llm_provider: str | None = os.getenv("LLM_PROVIDER", None)
    model_name: str | None = os.getenv("MODEL_NAME", None)
    
    host: str = "127.0.0.1"
    port: int = 8000

    def get_provider_and_model(self) -> tuple[str, str]:
        """
        Auto-detect the provider and return a tuple of (provider, model_name).
        Fallback order: gemini -> openai -> anthropic -> groq -> mock
        """
        provider = self.llm_provider
        
        # Auto-detect if not set
        if not provider or provider == "auto":
            if self.gemini_api_key:
                provider = "gemini"
            elif self.openai_api_key:
                provider = "openai"
            elif self.anthropic_api_key:
                provider = "anthropic"
            elif self.groq_api_key:
                provider = "groq"
            else:
                provider = "mock"
                
        # Resolve model name
        if self.model_name:
            return provider, self.model_name
            
        if provider == "gemini":
            return "gemini", "gemini-2.5-flash"
        elif provider == "openai":
            return "openai", "gpt-4o-mini"
        elif provider == "anthropic":
            return "anthropic", "claude-3-5-haiku-latest"
        elif provider == "groq":
            return "groq", "llama-3-3-70b-specdec"
        
        return "mock", "mock-model"

settings = Settings()
