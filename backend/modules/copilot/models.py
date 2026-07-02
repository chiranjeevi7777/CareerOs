from pydantic import BaseModel, Field
from typing import List, Optional


class JobParseRequest(BaseModel):
    text: str = Field(..., description="Raw text of the job description to parse")


class JobParseResponse(BaseModel):
    company: str
    role: str
    platform: str = "Other"
    requirements: List[str] = Field(default_factory=list)
    salary_range: Optional[str] = None
    key_skills: List[str] = Field(default_factory=list)


class ResumeTailorRequest(BaseModel):
    resume: str
    job_description: str


class ResumeTailorResponse(BaseModel):
    tailored_summary: str
    tailored_bullets: List[str] = Field(default_factory=list)
    keywords_to_add: List[str] = Field(default_factory=list)
    skill_gap_analysis: List[str] = Field(default_factory=list)


class CoverLetterRequest(BaseModel):
    resume: str
    job_description: str
    recipient_name: Optional[str] = None
    company_name: Optional[str] = None


class CoverLetterResponse(BaseModel):
    cover_letter: str
