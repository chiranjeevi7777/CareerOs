"""Copilot FastAPI router — job parse, resume tailor, cover letter."""
import logging
import traceback
from fastapi import APIRouter
from backend.shared.llm import get_llm_model
from .models import (
    JobParseRequest, JobParseResponse,
    ResumeTailorRequest, ResumeTailorResponse,
    CoverLetterRequest, CoverLetterResponse,
)
from .agents import get_job_parser_agent, get_resume_tailor_agent, get_cover_letter_agent
from .mock import mock_parse_job, mock_tailor_resume, mock_generate_cover_letter

logger = logging.getLogger("careeros.copilot")
router = APIRouter(tags=["Copilot"])


@router.post("/parse-job", response_model=JobParseResponse)
async def parse_job(payload: JobParseRequest):
    logger.info("Received request to parse job description")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            result = await get_job_parser_agent().run(payload.text)
            return result.data
        except Exception as e:
            logger.error(f"job_parser_agent error: {e}\n{traceback.format_exc()}")
    logger.info("Executing job parsing in mock-fallback mode")
    return mock_parse_job(payload.text)


@router.post("/tailor-resume", response_model=ResumeTailorResponse)
async def tailor_resume(payload: ResumeTailorRequest):
    logger.info("Received request to tailor resume")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            prompt = f"Resume:\n{payload.resume}\n\nJob Description:\n{payload.job_description}"
            result = await get_resume_tailor_agent().run(prompt)
            return result.data
        except Exception as e:
            logger.error(f"resume_tailor_agent error: {e}\n{traceback.format_exc()}")
    logger.info("Executing resume tailoring in mock-fallback mode")
    return mock_tailor_resume(payload.resume, payload.job_description)


@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
async def generate_cover_letter(payload: CoverLetterRequest):
    logger.info("Received request to generate cover letter")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            prompt = (
                f"Resume:\n{payload.resume}\n\nJob Description:\n{payload.job_description}"
                f"\nRecipient: {payload.recipient_name or 'N/A'}\nCompany: {payload.company_name or 'N/A'}"
            )
            result = await get_cover_letter_agent().run(prompt)
            return result.data
        except Exception as e:
            logger.error(f"cover_letter_agent error: {e}\n{traceback.format_exc()}")
    logger.info("Executing cover letter generation in mock-fallback mode")
    return mock_generate_cover_letter(
        payload.resume, payload.job_description,
        payload.recipient_name, payload.company_name
    )
