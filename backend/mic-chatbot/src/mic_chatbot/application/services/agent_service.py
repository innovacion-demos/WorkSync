"""Agent service interface (port)."""

from abc import ABC, abstractmethod


class AgentService(ABC):
    """Interface for AI agent interactions.

    Implementations should handle all orchestration including:
    - Conversation memory management
    - LLM interactions
    - MCP tool integration
    - Message history
    """

    @abstractmethod
    async def process_message(
        self,
        message: str,
        session_id: str
    ) -> str:
        """Process a user message and generate a response.

        Args:
            message: User's input message
            session_id: Unique session identifier (UUID from frontend)

        Returns:
            str: AI-generated response
        """
        pass
