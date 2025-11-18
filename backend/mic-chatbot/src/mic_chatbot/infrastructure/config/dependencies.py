"""Dependency injection container."""

from functools import lru_cache

from mic_chatbot.application.services.agent_service import AgentService
from mic_chatbot.application.use_cases.send_message_to_chatbot_use_case import SendMessageToChatBotUseCase
from mic_chatbot.infrastructure.services.langchain_agent_service import LangChainAgentService


@lru_cache
def get_agent_service() -> AgentService:
    """Get singleton instance of AgentService.

    Returns:
        AgentService: LangChain-based agent service

    Note:
        To switch to LangGraph implementation, uncomment the LangGraphAgentService import
        and change the return statement to: return LangGraphAgentService()
    """
    return LangChainAgentService()


def get_send_message_use_case() -> SendMessageToChatBotUseCase:
    """Get instance of SendMessageToChatBotUseCase.

    Returns:
        SendMessageToChatBotUseCase: Use case with injected dependencies
    """
    agent_service = get_agent_service()
    return SendMessageToChatBotUseCase(agent_service=agent_service)
