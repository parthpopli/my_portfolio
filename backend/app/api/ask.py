from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_services import answer_repo_question

router = APIRouter()


class AskRequest(BaseModel):
    question: str
    project_context: dict


@router.post("/ask")
def ask_repo(data: AskRequest):
    print(f"Question received: {data.question}")

    answer = answer_repo_question(
        question=data.question,
        project_context=data.project_context,
    )

    return {
        "success": True,
        "answer": answer,
    }