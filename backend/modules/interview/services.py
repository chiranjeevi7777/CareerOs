import uuid
from typing import Dict, Any, List
from .models import InterviewScorecard, QuestionFeedback
from backend.agents import (
    get_llm_model,
    interview_evaluation_agent, 
    interview_scorecard_agent,
    mock_interview_feedback,
    mock_interview_scorecard
)

# Standard interview question bank fallback
INTERVIEW_QUESTIONS_FALLBACK = [
    "Tell me about yourself and why you're interested in this role.",
    "Describe a challenging technical problem you solved. What was your approach and what did you learn?",
    "How do you handle conflict or differing opinions within an engineering team?",
    "Explain a time when you had to learn a new technology quickly to solve a problem. How did you go about it?",
    "What is your approach to ensuring code quality, testing, and performance optimization in production?"
]

class InterviewSession:
    def __init__(self, role: str, company: str, job_description: str = None):
        self.session_id = str(uuid.uuid4())
        self.role = role
        self.company = company
        self.job_description = job_description
        self.current_question_idx = 0
        self.questions = self._generate_questions()
        self.answers = []
        self.feedbacks = []
        self.is_complete = False

    def _generate_questions(self) -> List[str]:
        role_lower = self.role.lower()
        
        if "frontend" in role_lower or "react" in role_lower:
            return [
                f"Why do you want to join {self.company} as a Frontend Engineer?",
                "How do you optimize React application performance and prevent unnecessary re-renders?",
                "Describe your experience with CSS architectures and state management (e.g. Context, Redux, Zustand).",
                "How would you approach designing a reusable, accessible UI component library from scratch?",
                "Tell me about a time when you had to debug a complex visual or state bug. What tools did you use?"
            ]
        elif "backend" in role_lower or "django" in role_lower or "fastapi" in role_lower:
            return [
                f"What attracts you to the Backend Engineer position at {self.company}?",
                "How do you design database schemas and API endpoints to handle high concurrency and horizontal scaling?",
                "Explain the differences between REST, GraphQL, and gRPC, and when you would choose each.",
                "Describe how you implement security patterns like rate limiting, JWT authentication, and input validation.",
                "Tell me about a time when a database query or backend service caused a production bottleneck. How did you resolve it?"
            ]
        elif "dsa" in role_lower or "algorithms" in role_lower:
            return [
                "What is your strategy for analyzing the time and space complexity of an algorithm?",
                "Explain the difference between Dynamic Programming and Greedy algorithms with examples.",
                "How do you approach solving a graph traversal problem (BFS vs DFS)?",
                "Describe a complex data structure (like a Trie or Segment Tree) and a real-world scenario where it is useful.",
                "How do you balance write-optimized vs read-optimized data structures in system design?"
            ]
            
        return [
            f"Tell me about yourself and why you want to be a {self.role} at {self.company}.",
            "Describe a challenging technical project you worked on. What was your specific contribution?",
            "How do you handle ambiguous requirements or shifts in product direction?",
            "Explain how you ensure your code is production-ready, secure, and well-documented.",
            "Where do you see yourself technically in the next 2-3 years, and how does this role help you get there?"
        ]

    def get_current_question(self) -> str:
        if self.current_question_idx < len(self.questions):
            return self.questions[self.current_question_idx]
        return ""


class InterviewManager:
    def __init__(self):
        self.sessions: Dict[str, InterviewSession] = {}

    def create_session(self, role: str, company: str, job_description: str = None) -> InterviewSession:
        session = InterviewSession(role, company, job_description)
        self.sessions[session.session_id] = session
        return session

    def get_session(self, session_id: str) -> InterviewSession | None:
        return self.sessions.get(session_id)

    async def submit_answer(self, session_id: str, answer: str) -> tuple[QuestionFeedback, str | None, bool, InterviewScorecard | None]:
        session = self.get_session(session_id)
        if not session:
            raise ValueError("Session not found")
            
        current_q = session.get_current_question()
        
        # 1. Evaluate the answer
        is_mock = get_llm_model().__class__.__name__ == "TestModel"
        
        if is_mock:
            feedback = mock_interview_feedback(current_q, answer)
        else:
            try:
                # Run the evaluator agent
                prompt = f"Question: {current_q}\nCandidate Answer: {answer}\nJob Role: {session.role} at {session.company}"
                res = await interview_evaluation_agent().run(prompt)
                feedback = res.data
            except Exception as e:
                # Graceful fallback on LLM failure
                feedback = mock_interview_feedback(current_q, answer)
                
        # Store answer and feedback
        session.answers.append(answer)
        session.feedbacks.append(feedback)
        
        # Advance question index
        session.current_question_idx += 1
        
        next_q = None
        scorecard = None
        is_complete = False
        
        if session.current_question_idx >= len(session.questions):
            session.is_complete = True
            is_complete = True
            
            # Generate scorecard
            history = []
            for i in range(len(session.questions)):
                history.append({
                    "question": session.questions[i],
                    "answer": session.answers[i],
                    "score": session.feedbacks[i].score,
                    "feedback": session.feedbacks[i].feedback
                })
                
            if is_mock:
                scorecard = mock_interview_scorecard(history)
            else:
                try:
                    history_str = "\n\n".join([
                        f"Q: {h['question']}\nA: {h['answer']}\nScore: {h['score']}/10\nFeedback: {h['feedback']}"
                        for h in history
                    ])
                    res_scorecard = await interview_scorecard_agent().run(
                        f"Review the following interview history for a {session.role} role:\n\n{history_str}"
                    )
                    scorecard = res_scorecard.data
                except Exception as e:
                    scorecard = mock_interview_scorecard(history)
        else:
            next_q = session.get_current_question()
            
        return feedback, next_q, is_complete, scorecard


interview_manager = InterviewManager()
