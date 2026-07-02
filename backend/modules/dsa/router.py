"""DSA module: AI practice roadmap and problem recommendations."""
import logging
import traceback
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from backend.shared.llm import get_llm_model
from pydantic_ai import Agent

logger = logging.getLogger("careeros.dsa")
router = APIRouter(tags=["DSA"])


class DSAPracticeRequest(BaseModel):
    solved_problems: List[Dict[str, Any]] = Field(default_factory=list)
    target_role: str = "Software Engineer"

class DSAPracticeResponse(BaseModel):
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    weekly_plan: List[str] = Field(default_factory=list)
    suggested_problems: List[Dict[str, Any]] = Field(default_factory=list)


def mock_dsa_practice(solved_problems, target_role) -> DSAPracticeResponse:
    topics_solved = {p.get("topic", "") for p in solved_problems}
    all_topics = ["Arrays", "Strings", "Hashing", "Linked List", "Stack", "Queue",
                  "Tree", "Graph", "Heap", "DP", "Greedy", "Binary Search"]
    weak = [t for t in all_topics if t not in topics_solved][:4]
    strong = list(topics_solved)[:3] if topics_solved else ["Arrays"]
    return DSAPracticeResponse(
        strengths=[f"Strong in {s}" for s in strong] or ["Keep building your foundation!"],
        weaknesses=[f"Needs attention: {w}" for w in weak],
        weekly_plan=[
            "Day 1-2: Focus on Tree Traversal (DFS/BFS) basics.",
            "Day 3-4: Practice Dynamic Programming (Fibonacci, Knapsack).",
            "Day 5-6: Solve Graph problems (Dijkstra, BFS shortest path).",
            "Day 7: Review weak areas and attempt 2 mock interview problems.",
        ],
        suggested_problems=[
            {"name": "Two Sum", "topic": "Hashing", "difficulty": "Easy", "platform": "LeetCode", "url": "https://leetcode.com/problems/two-sum/"},
            {"name": "Longest Substring Without Repeating Characters", "topic": "Sliding Window", "difficulty": "Medium", "platform": "LeetCode", "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/"},
            {"name": "Binary Tree Level Order Traversal", "topic": "Tree", "difficulty": "Medium", "platform": "LeetCode", "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/"},
            {"name": "Coin Change", "topic": "DP", "difficulty": "Medium", "platform": "LeetCode", "url": "https://leetcode.com/problems/coin-change/"},
            {"name": "Number of Islands", "topic": "Graph", "difficulty": "Medium", "platform": "LeetCode", "url": "https://leetcode.com/problems/number-of-islands/"},
        ],
    )


_dsa_agent = None

def get_dsa_agent():
    global _dsa_agent
    if _dsa_agent is None:
        _dsa_agent = Agent(
            model=get_llm_model(),
            output_type=DSAPracticeResponse,
            system_prompt=(
                "You are an expert algorithm coach. Analyze the student's solved problems, "
                "identify strengths and gaps, create a weekly study plan, "
                "and recommend 5 specific LeetCode problems with URLs."
            ),
        )
    return _dsa_agent


@router.post("/dsa-recommendations", response_model=DSAPracticeResponse)
async def get_dsa_recommendations(payload: DSAPracticeRequest):
    logger.info("Generating DSA practice recommendations")
    model = get_llm_model()
    if isinstance(model, str):
        try:
            prompt = f"Solved: {payload.solved_problems}\nTarget role: {payload.target_role}"
            result = await get_dsa_agent().run(prompt)
            return result.data
        except Exception as e:
            logger.error(f"dsa_agent error: {e}\n{traceback.format_exc()}")
    return mock_dsa_practice(payload.solved_problems, payload.target_role)
