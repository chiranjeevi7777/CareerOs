from pydantic import BaseModel, Field
from typing import List, Optional

class MockInterviewStartRequest(BaseModel):
    role: str = Field(..., description="Target job title")
    company: str = Field(..., description="Target company name")
    job_description: Optional[str] = Field(None, description="Optional job description text to customize questions")

class MockInterviewStartResponse(BaseModel):
    session_id: str = Field(..., description="Unique interview session ID")
    message: str = Field(..., description="Welcome greeting message")
    question: str = Field(..., description="First interview question")

class SubmitAnswerRequest(BaseModel):
    session_id: str = Field(..., description="Interview session ID")
    answer: str = Field(..., description="User's text response/answer to the question")

class QuestionFeedback(BaseModel):
    score: int = Field(..., ge=1, le=10, description="Score for the answer out of 10")
    feedback: str = Field(..., description="Constructive critique of the answer")
    suggested_points: List[str] = Field(default_factory=list, description="Points that could have been included for a better score")

class InterviewScorecard(BaseModel):
    overall_rating: float = Field(..., description="Overall score out of 5")
    communication_score: int = Field(..., ge=1, le=10, description="Communication clarity and structure out of 10")
    technical_score: int = Field(..., ge=1, le=10, description="Technical accuracy and depth out of 10")
    problem_solving_score: int = Field(..., ge=1, le=10, description="Problem solving approach out of 10")
    cultural_fit_score: int = Field(..., ge=1, le=10, description="Cultural fit and behavioral alignment out of 10")
    strengths: List[str] = Field(default_factory=list, description="Key strengths identified during the interview")
    improvement_areas: List[str] = Field(default_factory=list, description="Key areas of improvement for the user")
    summary: str = Field(..., description="Brief overall summary of the candidate's performance")

class SubmitAnswerResponse(BaseModel):
    session_id: str = Field(..., description="Interview session ID")
    feedback: str = Field(..., description="Constructive feedback for the current answer")
    next_question: Optional[str] = Field(None, description="Next interview question. Null if interview is complete")
    is_complete: bool = Field(..., description="True if this was the final question")
    scorecard: Optional[InterviewScorecard] = Field(None, description="Scorecard if the interview is complete")
