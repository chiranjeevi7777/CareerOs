"""Networking module: AI outreach message drafter."""
import logging
import traceback
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from backend.shared.llm import get_llm_model
from pydantic_ai import Agent

logger = logging.getLogger("careeros.networking")
router = APIRouter(tags=["Networking"])


class OutreachDraftRequest(BaseModel):
    contact_name: str
    contact_role: Optional[str] = None
    contact_company: Optional[str] = None
    platform: str = "LinkedIn"
    goal: str = "informal chat"
    additional_context: Optional[str] = None

class OutreachDraftResponse(BaseModel):
    subject: Optional[str] = None
    body: str


def mock_outreach_draft(name, role, company, platform, goal, context) -> OutreachDraftResponse:
    is_email = platform.lower() == "email"
    role_str = f" ({role})" if role else ""
    company_str = f" at {company}" if company else ""
    subject = f"Quick question — {goal.title()}" if is_email else None
    body = (
        f"Hi {name}! Hope you're having a great week. "
        f"I came across your profile{company_str} and your work as{role_str} really impressed me. "
        f"I'm currently exploring {'new opportunities' if goal == 'referral' else 'connections'} in the industry "
        f"and would love to connect briefly for a {'referral conversation' if goal == 'referral' else 'quick chat'}. "
        f"{'Context: ' + context if context else ''}\n\nWould you be open to a 15-minute call sometime this week?"
    )
    return OutreachDraftResponse(subject=subject, body=body)


_outreach_agent = None

def get_outreach_agent():
    global _outreach_agent
    if _outreach_agent is None:
        _outreach_agent = Agent(
            model=get_llm_model(),
            output_type=OutreachDraftResponse,
            system_prompt=(
                "You are a professional networking coach. Draft a concise, personalised outreach message. "
                "Adapt tone to the platform (LinkedIn = conversational, Email = professional). "
                "Keep body under 120 words. Include a clear call to action."
            ),
        )
    return _outreach_agent


@router.post("/outreach-draft", response_model=OutreachDraftResponse)
async def generate_outreach_draft(payload: OutreachDraftRequest):
    logger.info(f"Generating outreach draft for {payload.contact_name}")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            prompt = (
                f"Contact: {payload.contact_name} | Role: {payload.contact_role} | "
                f"Company: {payload.contact_company} | Platform: {payload.platform} | "
                f"Goal: {payload.goal} | Context: {payload.additional_context}"
            )
            result = await get_outreach_agent().run(prompt)
            return result.data
        except Exception as e:
            logger.error(f"outreach_agent error: {e}\n{traceback.format_exc()}")
    return mock_outreach_draft(
        payload.contact_name, payload.contact_role, payload.contact_company,
        payload.platform, payload.goal, payload.additional_context
    )
