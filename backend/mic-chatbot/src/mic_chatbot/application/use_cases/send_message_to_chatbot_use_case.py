"""Send message to chatbot use case."""

from mic_chatbot.application.services.agent_service import AgentService
from mic_chatbot.infrastructure.config.logger import logger


class SendMessageToChatBotUseCase:
    """Use case for sending a message to the chatbot and receiving a response."""

    def __init__(self, agent_service: AgentService):
        """Initialize use case with agent service.

        Args:
            agent_service: Agent service for processing messages
        """
        self.agent_service = agent_service

    async def execute(self, message: str, session_id: str) -> str:
        """Execute the use case.

        Args:
            message: User's input message
            session_id: Unique session identifier (UUID from frontend)

        Returns:
            str: AI-generated response
        """
        logger.info(f"Executing SendMessageToChatBot for session {session_id}")

        response = await self.agent_service.process_message(
            message=message,
            session_id=session_id
        )

        logger.info(f"Use case completed successfully for session {session_id}")
        return response
