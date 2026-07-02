"""
Copilot AI agents — job parse, resume tailor, cover letter.
Agents are created lazily (on first request) to avoid import-time model resolution.
"""
from pydantic_ai import Agent
from backend.shared.llm import get_llm_model
from .models import JobParseResponse, ResumeTailorResponse, CoverLetterResponse

_job_parser_agent = None
_resume_tailor_agent = None
_cover_letter_agent = None


def get_job_parser_agent():
    global _job_parser_agent
    if _job_parser_agent is None:
        _job_parser_agent = Agent(
            model=get_llm_model(),
            output_type=JobParseResponse,
            system_prompt=(
                "You are an expert ATS parser. Extract: company, role, requirements, "
                "salary range, and key skills from the job description."
            ),
        )
    return _job_parser_agent


def get_resume_tailor_agent():
    global _resume_tailor_agent
    if _resume_tailor_agent is None:
        _resume_tailor_agent = Agent(
            model=get_llm_model(),
            output_type=ResumeTailorResponse,
            system_prompt=(
                "You are an expert resume writer. Compare the resume with the job description. "
                "Write an optimized summary, 3-5 tailored bullet points, missing keywords, and gap analysis."
            ),
        )
    return _resume_tailor_agent


def get_cover_letter_agent():
    global _cover_letter_agent
    if _cover_letter_agent is None:
        _cover_letter_agent = Agent(
            model=get_llm_model(),
            output_type=CoverLetterResponse,
            system_prompt=(
                "Write a compelling professional cover letter matching the resume to the job. "
                "Keep it under 300 words. Use the hiring manager name if provided."
            ),
        )
    return _cover_letter_agent
