import logging
from fastapi import APIRouter, HTTPException

from .models import (
    MockInterviewStartRequest, MockInterviewStartResponse,
    SubmitAnswerRequest, SubmitAnswerResponse,
)
from .services import interview_manager

logger = logging.getLogger("careeros.interview")
router = APIRouter(tags=["Interview"])

@router.post("/mock-interview/start", response_model=MockInterviewStartResponse)
async def start_mock_interview(payload: MockInterviewStartRequest):
    logger.info(f"Starting mock interview for role '{payload.role}' at '{payload.company}'")
    session = interview_manager.create_session(
        payload.role, payload.company, getattr(payload, "job_description", None)
    )
    return MockInterviewStartResponse(
        session_id=session.session_id,
        message=f"Welcome! Let's start your mock interview for the {payload.role} role at {payload.company}.",
        question=session.get_current_question(),
    )

@router.post("/mock-interview/submit-answer", response_model=SubmitAnswerResponse)
async def submit_answer(payload: SubmitAnswerRequest):
    logger.info(f"Answer submitted for session {payload.session_id}")
    session = interview_manager.get_session(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")
    feedback, next_q, is_complete, scorecard = await interview_manager.submit_answer(
        payload.session_id, payload.answer
    )
    return SubmitAnswerResponse(
        session_id=payload.session_id,
        feedback=feedback.feedback,
        next_question=next_q,
        is_complete=is_complete,
        scorecard=scorecard,
    )
