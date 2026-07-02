from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Job parsing schemas
class JobParseRequest(BaseModel):
    text: str = Field(..., description="Raw text of the job description to parse")

class JobParseResponse(BaseModel):
    company: str = Field(..., description="Name of the company hiring")
    role: str = Field(..., description="Job title/role")
    platform: str = Field("Other", description="Platform found (LinkedIn, Indeed, etc.)")
    requirements: List[str] = Field(default_factory=list, description="Key requirements/bullet points of the job")
    salary_range: Optional[str] = Field(None, description="Estimated salary range if found")
    key_skills: List[str] = Field(default_factory=list, description="Specific skills mentioned in the job description")

# Resume tailoring schemas
class ResumeTailorRequest(BaseModel):
    resume: str = Field(..., description="Current resume content in raw text format")
    job_description: str = Field(..., description="Target job description")

class ResumeTailorResponse(BaseModel):
    tailored_summary: str = Field(..., description="An optimized profile summary tailored to this role")
    tailored_bullets: List[str] = Field(default_factory=list, description="Tailored resume bullet points emphasizing matching achievements")
    keywords_to_add: List[str] = Field(default_factory=list, description="Important keywords/skills missing from current resume")
    skill_gap_analysis: List[str] = Field(default_factory=list, description="Constructive analysis of areas where candidate lacks matching experience")

# Cover letter schemas
class CoverLetterRequest(BaseModel):
    resume: str = Field(..., description="Current resume content")
    job_description: str = Field(..., description="Target job description")
    recipient_name: Optional[str] = Field(None, description="Name of hiring manager if known")
    company_name: Optional[str] = Field(None, description="Name of target company")

class CoverLetterResponse(BaseModel):
    cover_letter: str = Field(..., description="Generated professional cover letter")

# Mock Interview schemas
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

# Hybrid Search schemas
class HybridSearchRequest(BaseModel):
    query: str = Field(..., description="Search query")
    items: List[Dict[str, Any]] = Field(..., description="List of items (applications, networking, etc.) to search through")
    limit: int = Field(10, description="Max number of search results to return")

class HybridSearchResultItem(BaseModel):
    item: Dict[str, Any] = Field(..., description="The original search item")
    relevance_score: float = Field(..., description="The hybrid relevance score (fused)")
    source: str = Field(..., description="Which search method found the item ('keyword', 'vector', 'hybrid')")
    rank: int = Field(..., description="Fused rank of the item")

class HybridSearchResponse(BaseModel):
    results: List[HybridSearchResultItem] = Field(default_factory=list, description="Ranked list of search results")

# AI Insights schemas
class AIInsightsRequest(BaseModel):
    applications: List[Dict[str, Any]] = Field(default_factory=list)
    interviews: List[Dict[str, Any]] = Field(default_factory=list)
    dsa: List[Dict[str, Any]] = Field(default_factory=list)
    networking: List[Dict[str, Any]] = Field(default_factory=list)
    settings: Dict[str, Any] = Field(default_factory=dict)

class AIInsightItem(BaseModel):
    category: str = Field(..., description="Insight category (e.g. applications, dsa, networking, conversion)")
    title: str = Field(..., description="Short title summarizing the insight")
    description: str = Field(..., description="Detailed explanation of the findings")
    type: str = Field("info", description="Type of insight: 'positive', 'warning', 'info'")
    action_item: str = Field(..., description="Suggested immediate next step")

class AIInsightsResponse(BaseModel):
    summary: str = Field(..., description="Executive summary paragraph")
    insights: List[AIInsightItem] = Field(default_factory=list)
    recommended_focus: str = Field(..., description="Top focus area for the upcoming week")

# Outreach draft schemas
class OutreachDraftRequest(BaseModel):
    contact_name: str = Field(...)
    contact_role: Optional[str] = Field(None)
    contact_company: Optional[str] = Field(None)
    platform: str = Field("LinkedIn")
    goal: str = Field("informal chat", description="Goal: 'informal chat', 'referral', 'follow up'")
    additional_context: Optional[str] = Field(None)

class OutreachDraftResponse(BaseModel):
    subject: Optional[str] = Field(None, description="Recommended subject line (mostly for Email)")
    body: str = Field(..., description="Drafted message body")

# DSA Practice schemas
class DSAPracticeRequest(BaseModel):
    solved_problems: List[Dict[str, Any]] = Field(default_factory=list)
    target_role: str = Field("Software Engineer")

class DSAPracticeResponse(BaseModel):
    strengths: List[str] = Field(default_factory=list, description="Topics where student is strong")
    weaknesses: List[str] = Field(default_factory=list, description="Gaps / underrepresented topics")
    weekly_plan: List[str] = Field(default_factory=list, description="Step-by-step topics to solve next")
    suggested_problems: List[Dict[str, Any]] = Field(default_factory=list, description="List of recommended problems to log")

