import os
from pydantic_ai import Agent
from pydantic_ai.models.test import TestModel

from .config import settings
from .models import (
    JobParseResponse, 
    ResumeTailorResponse, 
    CoverLetterResponse, 
    QuestionFeedback, 
    InterviewScorecard,
    AIInsightsResponse,
    OutreachDraftResponse,
    DSAPracticeResponse
)

# Helper to construct the correct PydanticAI model specification
def get_llm_model():
    provider, model_name = settings.get_provider_and_model()
    
    if provider == "gemini" and settings.gemini_api_key:
        # Set environment variable so pydantic-ai library can find it
        os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
        return f"gemini:{model_name}"
    elif provider == "openai" and settings.openai_api_key:
        os.environ["OPENAI_API_KEY"] = settings.openai_api_key
        return f"openai:{model_name}"
    elif provider == "anthropic" and settings.anthropic_api_key:
        os.environ["ANTHROPIC_API_KEY"] = settings.anthropic_api_key
        return f"anthropic:{model_name}"
    elif provider == "groq" and settings.groq_api_key:
        os.environ["GROQ_API_KEY"] = settings.groq_api_key
        return f"groq:{model_name}"
        
    # Fallback to TestModel for local development without keys
    return TestModel()

# Lazy singleton cache
_agents = {}

def _lazy(name, output_type, system_prompt):
    if name not in _agents:
        _agents[name] = Agent(
            model=get_llm_model(),
            output_type=output_type,
            system_prompt=system_prompt,
        )
    return _agents[name]


def job_parser_agent():
    return _lazy('job_parser', JobParseResponse,
        "You are an expert ATS parser. Extract company, role, requirements, salary range, key skills.")

def resume_tailor_agent():
    return _lazy('resume_tailor', ResumeTailorResponse,
        "You are an expert resume writer. Write tailored summary, bullet points, keywords, gap analysis.")

def cover_letter_agent():
    return _lazy('cover_letter', CoverLetterResponse,
        "Write a compelling cover letter under 300 words matching the resume to the job.")

def interview_evaluation_agent():
    return _lazy('interview_eval', QuestionFeedback,
        "You are an expert interviewer. Score the answer out of 10, give concrete feedback and suggested points.")

def interview_scorecard_agent():
    return _lazy('interview_scorecard', InterviewScorecard,
        "Review all Q&A and score Communication, Technical, Problem Solving, Cultural Fit. Summarize performance.")

def analytics_insights_agent():
    return _lazy('analytics', AIInsightsResponse,
        "Career strategist: analyze job search logs, provide 3-5 insights and a weekly focus area.")

def outreach_drafter_agent():
    return _lazy('outreach', OutreachDraftResponse,
        "Professional networker: write tailored outreach under 150 words for the given platform and goal.")

def dsa_recommender_agent():
    return _lazy('dsa', DSAPracticeResponse,
        "Coding tutor: identify DSA strengths/gaps, create weekly plan, recommend 5 specific LeetCode problems.")

# ── Fallback Mock Executions ──
# These functions will run if get_llm_model() returns TestModel (signaling no active API key).
# They generate highly detailed, custom, realistic mock responses to make the UI look rich and functional.

def mock_parse_job(text: str) -> JobParseResponse:
    # Basic text searches to extract possible role/company
    text_lower = text.lower()
    company = "TechCorp"
    role = "Software Engineer"
    platform = "LinkedIn"
    
    if "google" in text_lower:
        company = "Google"
    elif "meta" in text_lower:
        company = "Meta"
    elif "netflix" in text_lower:
        company = "Netflix"
    elif "amazon" in text_lower:
        company = "Amazon"
    elif "microsoft" in text_lower:
        company = "Microsoft"
    elif "apple" in text_lower:
        company = "Apple"
    elif "openai" in text_lower:
        company = "OpenAI"

    if "frontend" in text_lower or "react" in text_lower:
        role = "Frontend Engineer"
    elif "backend" in text_lower or "django" in text_lower or "fastapi" in text_lower:
        role = "Backend Engineer"
    elif "fullstack" in text_lower or "full-stack" in text_lower:
        role = "Full Stack Developer"
    elif "ai" in text_lower or "machine learning" in text_lower or "agent" in text_lower:
        role = "AI Engineer"

    # Default mock requirements
    requirements = [
        "Develop scalable web applications using modern JavaScript/TypeScript and Python frameworks.",
        "Collaborate with design and product teams to translate requirements into responsive UI components.",
        "Implement secure, performant RESTful APIs and database schemas.",
        "Participate in code reviews, write comprehensive tests, and maintain CI/CD pipelines.",
        "3+ years of experience in Software Engineering or equivalent field."
    ]
    
    key_skills = ["Python", "FastAPI", "React", "TypeScript", "SQL", "Git", "Docker"]
    salary_range = "$120,000 - $150,000 / year"
    
    return JobParseResponse(
        company=company,
        role=role,
        platform=platform,
        requirements=requirements,
        salary_range=salary_range,
        key_skills=key_skills
    )

def mock_tailor_resume(resume: str, job_desc: str) -> ResumeTailorResponse:
    return ResumeTailorResponse(
        tailored_summary=(
            "Results-driven Software Engineer with a strong foundation in designing, building, and deploying "
            "responsive web applications and API integrations. Proven expertise in using React and modern Python (FastAPI/Django) "
            "to create secure, client-facing services. Adept at analyzing system performance bottlenecks and writing clean, "
            "testable code that directly aligns with team development velocity and production-grade delivery."
        ),
        tailored_bullets=[
            "Refactored legacy application services to use modern asynchronous API design in FastAPI, reducing latency by 40%.",
            "Designed and implemented interactive React-based dashboard charts using Tailwind CSS, increasing user engagement by 25%.",
            "Added robust unit testing suites using Pytest and Jest, raising overall codebase test coverage from 45% to 82%."
        ],
        keywords_to_add=["FastAPI", "Pydantic", "Async I/O", "TypeScript", "HNSW Vector Indexes", "Semantic Search"],
        skill_gap_analysis=[
            "No direct mention of Docker/Kubernetes container orchestration on the current resume, which is requested in the job requirements.",
            "Lacks detailed examples of building microservices or event-driven queues (e.g. RabbitMQ/Kafka) mentioned as a plus."
        ]
    )

def mock_generate_cover_letter(resume: str, job_desc: str, recipient: str = None, company: str = None) -> CoverLetterResponse:
    rec = recipient or "Hiring Team"
    comp = company or "Target Company"
    
    letter = f"""Dear {rec},

I am writing to express my strong interest in the Software Engineer position at {comp}. With a solid background in full-stack web development and a passion for engineering clean, reliable code, I am confident that my skills and experiences align perfectly with the goals of your engineering team.

In my previous roles, I have focused on building highly responsive user interfaces in React and optimizing database performance. I noticed that {comp} values engineers who understand both frontend aesthetics and backend architecture. I have successfully led features that combined interactive dashboards with FastAPI backends, ensuring smooth data flows and type-safe schema validation. 

I am particularly excited about this role because {comp} is innovating rapidly. I would welcome the opportunity to bring my technical expertise, problem-solving mindset, and dedication to code quality to your team. Thank you for your time and consideration.

Sincerely,
[Your Name]"""

    return CoverLetterResponse(cover_letter=letter)

def mock_interview_feedback(question: str, answer: str) -> QuestionFeedback:
    # Create interactive feedback
    score = 7
    word_count = len(answer.split())
    
    if word_count < 10:
        score = 4
        feedback = "Your answer is extremely brief. Try expanding with the STAR method (Situation, Task, Action, Result) to provide sufficient detail."
        suggested_points = ["Describe the context of the problem", "Outline the exact steps you took", "Mention the measurable outcome"]
    else:
        score = 8
        feedback = "Great structure! You clearly articulated the core concepts and explained how they apply. The communication was concise and structured."
        suggested_points = ["Provide a quantitative metric of success", "Explicitly mention alternative trade-offs you considered"]
        
    return QuestionFeedback(
        score=score,
        feedback=feedback,
        suggested_points=suggested_points
    )

def mock_interview_scorecard(history: list[dict]) -> InterviewScorecard:
    # Aggregate scores from history
    scores = [item.get("score", 7) for item in history]
    avg = sum(scores) / len(scores) if scores else 7.0
    overall = round((avg / 10) * 5, 2)
    
    return InterviewScorecard(
        overall_rating=overall,
        communication_score=min(10, int(avg + 1)),
        technical_score=min(10, int(avg)),
        problem_solving_score=min(10, int(avg - 0.5)),
        cultural_fit_score=min(10, int(avg + 0.5)),
        strengths=[
            "Demonstrated clear technical vocabulary and understanding of system patterns.",
            "Structured thoughts methodically, making it easy to follow along.",
            "Strong focus on code quality, testing, and performance."
        ],
        improvement_areas=[
            "Could explain system trade-offs more explicitly when choosing tools.",
            "Remember to define business metrics or client impacts for achievements."
        ],
        summary="The candidate showed strong engineering capability and structured communication. With minor adjustments to detailing trade-offs, they will perform exceptionally well in target technical interviews."
    )

def mock_analytics_insights(apps, interviews, dsa, networking, settings) -> AIInsightsResponse:
    from datetime import datetime
    return AIInsightsResponse(
        summary=(
            "Your application pipeline is active, but you are experiencing a typical funnel drop-off "
            "between cold applications and initial assessments. Your DSA practice has been consistent, "
            "but networking remains your highest-leverage growth area to bypass cold application filters."
        ),
        insights=[
            {
                "category": "applications",
                "title": "Funnel Optimization Opportunity",
                "description": f"You have logged {len(apps)} total applications. Your yield of interviews ({len(interviews)}) is around {round(len(interviews)/len(apps)*100, 1) if apps else 5.0}%, which matches the market average, but can be improved with customized resume tailoring.",
                "type": "info",
                "action_item": "Utilize the Resume Tailoring feature for your next 3 applications to target key ATS keywords."
            },
            {
                "category": "networking",
                "title": "High Leverage: Cold outreach is low",
                "description": f"You have {len(networking)} contacts. Industry data shows that 70% of offers originate from warm introductions, but your networking activity is low this week.",
                "type": "warning",
                "action_item": "Send 2 short outreach messages to engineers in target companies using the Outreach Drafter."
            },
            {
                "category": "dsa",
                "title": "Consistent Practice Momentum",
                "description": f"You solved {len(dsa)} problems recently, which keeps your algorithmic logic sharp for upcoming technical rounds.",
                "type": "positive",
                "action_item": "Keep this streak going! Try logging at least 1 Medium difficulty problem today."
            }
        ],
        recommended_focus="Warm networking and cold messaging using tailored outreach to boost interview invitation yields."
    )

def mock_outreach_draft(name: str, role: str, company: str, platform: str, goal: str, context: str) -> OutreachDraftResponse:
    comp_str = f" @ {company}" if company else ""
    role_str = f" as a {role}" if role else ""
    
    if platform.lower() == "email":
        subject = f"Connecting from a fellow developer / Coffee chat?"
        body = (
            f"Hi {name},\n\n"
            f"I hope you are doing well! I came across your profile and was really impressed by your career path{comp_str}.\n\n"
            f"I am a developer currently preparing for my next role. I love what your team is building, especially around scalability. "
            f"Would you be open to a 10-minute virtual coffee chat next week? I would love to learn more about your experience and the engineering culture there.\n\n"
            f"Thanks so much,\n"
            f"[Your Name]"
        )
    else:
        subject = None
        body = (
            f"Hi {name}! Hope you're having a great week. I saw your posts about engineering{comp_str} "
            f"and would love to connect. I'm currently expanding my network of technical professionals. "
            f"If you ever have 10 mins for a quick virtual chat, I'd love to ask a couple of quick questions about the team's tech stack. Cheers!"
        )
        
    return OutreachDraftResponse(subject=subject, body=body)

def mock_dsa_practice(solved_problems, target_role) -> DSAPracticeResponse:
    return DSAPracticeResponse(
        strengths=["Arrays & Hashing (highly represented)", "Binary Search and Basic Recursion"],
        weaknesses=["Dynamic Programming (DP)", "Graphs & Trees (under-represented relative to target role)"],
        weekly_plan=[
            "Day 1-2: Focus on Tree Traversal (DFS/BFS) basics.",
            "Day 3-4: Solve 2 Medium DP problems using Memoization.",
            "Day 5-7: Practice Graph representation and Dijkstra's algorithm."
        ],
        suggested_problems=[
            {
                "name": "Validate Binary Search Tree",
                "difficulty": "Medium",
                "topic": "Tree",
                "platform": "LeetCode",
                "url": "https://leetcode.com/problems/validate-binary-search-tree/"
            },
            {
                "name": "Climbing Stairs",
                "difficulty": "Easy",
                "topic": "DP",
                "platform": "LeetCode",
                "url": "https://leetcode.com/problems/climbing-stairs/"
            },
            {
                "name": "Number of Islands",
                "difficulty": "Medium",
                "topic": "Graph",
                "platform": "LeetCode",
                "url": "https://leetcode.com/problems/number-of-islands/"
            }
        ]
    )
