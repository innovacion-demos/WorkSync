"""Chat controller for conversation endpoints."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from mic_chatbot.application.use_cases.send_message_to_chatbot_use_case import SendMessageToChatBotUseCase
from mic_chatbot.infrastructure.config.logger import logger


router = APIRouter(prefix="/api/v1/chat", tags=["chat"])


class ChatRequest(BaseModel):
    """Chat request model."""

    message: str


class ChatResponse(BaseModel):
    """Chat response model."""

    answer: str


def get_use_case() -> SendMessageToChatBotUseCase:
    """Dependency injection for use case.

    Returns:
        SendMessageToChatBotUseCase: Use case instance
    """
    from mic_chatbot.infrastructure.config.dependencies import get_send_message_use_case
    return get_send_message_use_case()


@router.post("/{session_id}", response_model=ChatResponse)
async def chat(
    session_id: str,
    request: ChatRequest,
    use_case: SendMessageToChatBotUseCase = Depends(get_use_case)
) -> ChatResponse:
    """Process a chat message and return AI response.

    Args:
        session_id: Unique conversation session ID (UUID from frontend)
        request: Chat request with user message
        use_case: Injected use case

    Returns:
        ChatResponse: JSON response with 'answer' field
    """

    answer = await use_case.execute(
        message=request.message,
        session_id=session_id
    )

    logger.info(f"Returning response for session {session_id}")
    return ChatResponse(answer=answer)
