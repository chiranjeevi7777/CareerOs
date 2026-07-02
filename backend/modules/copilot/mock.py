"""
Copilot mock fallbacks.
Called when no LLM API key is configured or when the agent errors.
"""
from .models import JobParseResponse, ResumeTailorResponse, CoverLetterResponse


def mock_parse_job(text: str) -> JobParseResponse:
    lines = text.strip().splitlines()
    company = next((l for l in lines if len(l.strip()) > 3), "Unknown Company")
    return JobParseResponse(
        company=company[:40].strip(),
        role="Software Engineer",
        platform="Other",
        requirements=["Strong programming skills", "Team collaboration", "Problem solving"],
        salary_range="Competitive",
        key_skills=["Python", "SQL", "Communication"],
    )


def mock_tailor_resume(resume: str, job_description: str) -> ResumeTailorResponse:
    return ResumeTailorResponse(
        tailored_summary=(
            "Results-driven software engineer with experience delivering scalable systems. "
            "Strong alignment with the role's technical requirements."
        ),
        tailored_bullets=[
            "• Engineered high-throughput data pipelines, reducing processing time by 40%.",
            "• Collaborated cross-functionally to ship 3 product features per quarter.",
            "• Implemented automated testing, achieving 85% code coverage.",
        ],
        keywords_to_add=["Agile", "CI/CD", "Microservices"],
        skill_gap_analysis=["Consider deepening Kubernetes experience for cloud-native roles."],
    )


def mock_generate_cover_letter(resume: str, job_description: str, recipient_name=None, company_name=None) -> CoverLetterResponse:
    company = company_name or "your company"
    recipient = f"Dear {recipient_name}" if recipient_name else "Dear Hiring Manager"
    return CoverLetterResponse(
        cover_letter=(
            f"{recipient},\n\n"
            f"I am excited to apply for this role at {company}. "
            "My background in software engineering and passion for building impactful products "
            "make me a strong candidate. I thrive in collaborative environments and consistently "
            "deliver results that align with business goals.\n\n"
            "I look forward to discussing how I can contribute to your team.\n\n"
            "Sincerely,\n[Your Name]"
        )
    )
