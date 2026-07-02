"""Analytics module: AI performance insights."""
import logging
import traceback
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from backend.shared.llm import get_llm_model
from pydantic_ai import Agent

logger = logging.getLogger("careeros.analytics")
router = APIRouter(tags=["Analytics"])


# ── Schemas ──────────────────────────────────────────────
class AIInsightsRequest(BaseModel):
    applications: List[Dict[str, Any]] = Field(default_factory=list)
    interviews: List[Dict[str, Any]] = Field(default_factory=list)
    dsa: List[Dict[str, Any]] = Field(default_factory=list)
    networking: List[Dict[str, Any]] = Field(default_factory=list)
    settings: Dict[str, Any] = Field(default_factory=dict)

class AIInsightItem(BaseModel):
    category: str
    title: str
    description: str
    type: str = "info"
    action_item: str

class AIInsightsResponse(BaseModel):
    summary: str
    insights: List[AIInsightItem] = Field(default_factory=list)
    recommended_focus: str


# ── Mock ──────────────────────────────────────────────────
def mock_analytics_insights(apps, ivs, dsa, net, settings) -> AIInsightsResponse:
    total = len(apps)
    interviews = len(ivs)
    rate = round((interviews / total) * 100, 1) if total > 0 else 0
    return AIInsightsResponse(
        summary=(
            f"Your pipeline has {total} applications with a {rate}% interview conversion. "
            "Focus on personalised outreach and targeted applications to improve yield."
        ),
        insights=[
            AIInsightItem(
                category="applications", type="info" if total > 0 else "warning",
                title="Application Volume",
                description=f"You have submitted {total} applications." if total > 0 else "No applications tracked yet.",
                action_item="Aim for 10+ targeted applications per week."
            ),
            AIInsightItem(
                category="conversion", type="positive" if rate >= 10 else "warning",
                title="Interview Conversion Rate",
                description=f"Your interview rate is {rate}%.",
                action_item="Tailor each resume using the AI Copilot before applying."
            ),
            AIInsightItem(
                category="networking", type="positive" if len(net) >= 10 else "info",
                title="Network Building",
                description=f"You have {len(net)} professional contacts.",
                action_item="Send 5 new personalised LinkedIn messages this week."
            ),
        ],
        recommended_focus="Warm networking and personalised outreach to boost interview invitation yield."
    )


# ── Agent ─────────────────────────────────────────────────
_analytics_agent = None

def get_analytics_agent():
    global _analytics_agent
    if _analytics_agent is None:
        _analytics_agent = Agent(
            model=get_llm_model(),
            output_type=AIInsightsResponse,
            system_prompt=(
                "You are a senior career strategist. Analyze the user's job search data and "
                "provide 3 actionable insights with clear next steps. Classify each as positive/warning/info."
            ),
        )
    return _analytics_agent


# ── Route ─────────────────────────────────────────────────
@router.post("/analytics-insights", response_model=AIInsightsResponse)
async def get_analytics_insights(payload: AIInsightsRequest):
    logger.info("Generating AI analytics insights")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            prompt = (
                f"Applications: {len(payload.applications)}\n"
                f"Interviews: {len(payload.interviews)}\n"
                f"DSA problems: {len(payload.dsa)}\n"
                f"Network contacts: {len(payload.networking)}"
            )
            result = await get_analytics_agent().run(prompt)
            return result.data
        except Exception as e:
            logger.error(f"analytics_agent error: {e}\n{traceback.format_exc()}")
    return mock_analytics_insights(
        payload.applications, payload.interviews,
        payload.dsa, payload.networking, payload.settings
    )
