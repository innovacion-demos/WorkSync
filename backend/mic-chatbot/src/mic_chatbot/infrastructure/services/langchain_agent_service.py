"""LangChain-based agent service implementation."""

from typing import List

from langchain.agents import create_agent
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.checkpoint.memory import MemorySaver

from mic_chatbot.application.services.agent_service import AgentService
from mic_chatbot.infrastructure.config.logger import logger


class LangChainAgentService(AgentService):
    """Agent service implementation using LangChain.

    Simplified implementation that uses create_agent for orchestration:
    - Conversation memory via checkpointer
    - LLM interactions via Gemini
    - MCP tool integration using langchain_mcp_adapters
    """

    # Hardcoded configuration (shared with LangGraph implementation)
    _GEMINI_API_KEY: str = "Dont look here :P"
    _MCP_SERVER_URLS: List[str] = [
        "http://127.0.0.1:9001/mcp",
    ]
    _GEMINI_MODEL: str = "gemini-2.5-flash"
    _TEMPERATURE: float = 0.2

    # System prompt configuration
    _SYSTEM_PROMPT: str = (
        "You are a helpful assistant with access to specialized tools. "
        "When the user asks a question, evaluate if you need to use any available tools. "
        "If the question requires searching for specific information, you MUST use the tools. "
        "Clearly describe which tool you are using and why."
    )

    def __init__(self):
        """Initialize LangChain agent."""
        logger.info("Initializing LangChain Agent Service")
        logger.info(f"Using Gemini model: {self._GEMINI_MODEL}")
        logger.debug(f"System prompt: {self._SYSTEM_PROMPT}")

        # Initialize Gemini LLM
        self.chat_model = ChatGoogleGenerativeAI(
            model=self._GEMINI_MODEL,
            google_api_key=self._GEMINI_API_KEY,
            temperature=self._TEMPERATURE,
        )
        logger.info("Gemini LLM initialized successfully")

        # Initialize memory checkpointer
        self.memory = MemorySaver()
        logger.info("Memory checkpointer initialized")

        # Configure MCP client
        self.mcp_client = self._configure_mcp_client()

        # Tools will be loaded asynchronously on first use
        self.tools = []
        self.agent = None
        self._initialized = False

        logger.info("LangChain Agent service created (tools will be loaded on first use)")

    def _configure_mcp_client(self) -> MultiServerMCPClient | None:
        """Configure MultiServerMCPClient for MCP tool servers.

        Returns:
            MultiServerMCPClient or None if no servers configured
        """
        if not self._MCP_SERVER_URLS:
            logger.info("No MCP servers configured")
            return None

        logger.info(f"Configuring MCP client for {len(self._MCP_SERVER_URLS)} server(s)")

        # Build server configuration dictionary
        server_configs = {}
        for i, url in enumerate(self._MCP_SERVER_URLS):
            server_name = f"mcp_server_{i+1}"
            server_configs[server_name] = {
                "transport": "streamable_http",
                "url": url
            }
            logger.info(f"  - {server_name}: {url}")

        # Create MultiServerMCPClient
        mcp_client = MultiServerMCPClient(server_configs)
        logger.info("MCP client configured successfully")

        return mcp_client

    async def _ensure_initialized(self):
        """Initialize MCP tools asynchronously on first use."""
        if self._initialized:
            return

        if not self.mcp_client:
            logger.info("No MCP client configured, skipping tool initialization")
            self._initialized = True
            return

        logger.info("Initializing MCP tools...")

        try:
            # Get tools from all MCP servers asynchronously
            self.tools = await self.mcp_client.get_tools()

            logger.info(f"Loaded {len(self.tools)} tools from MCP server(s)")
            if self.tools:
                tool_names = [tool.name for tool in self.tools]
                logger.debug(f"Available tools: {tool_names}")

            # Create agent with checkpointer and MCP tools
            logger.info("Creating LangChain agent with tools")
            self.agent = create_agent(
                self.chat_model,
                self.tools,
                checkpointer=self.memory
            )

            self._initialized = True
            logger.info("Agent initialization completed successfully")

        except Exception as e:
            logger.error(f"Failed to initialize MCP tools: {e}", exc_info=True)
            logger.warning("Continuing without tools")
            self._initialized = True

    async def _invoke_async(self, message: str, session_id: str) -> str:
        """Process user query using the agent with persistent memory.

        History is automatically maintained per thread_id (session_id).
        Uses ainvoke() to support asynchronous MCP tools.

        Args:
            message: User's input message
            session_id: Unique session identifier

        Returns:
            str: AI-generated response
        """
        # Ensure MCP tools are initialized
        await self._ensure_initialized()

        if self.agent is None:
            logger.error("Agent failed to initialize")
            return "Agent initialization failed. Please check logs."

        logger.info(f"Invoking agent for session '{session_id}'")
        logger.debug(f"User message: {message}")

        try:
            # Prepare messages with system instructions
            messages = [
                SystemMessage(content=self._SYSTEM_PROMPT),
                HumanMessage(content=message)
            ]

            # Use ainvoke() for asynchronous tools
            response = await self.agent.ainvoke(
                {"messages": messages},
                {"configurable": {"thread_id": session_id}}
            )

            # Extract response from the agent's last message
            if "messages" in response and len(response["messages"]) > 0:
                last_message = response["messages"][-1]
                content = last_message.content if hasattr(last_message, 'content') else str(last_message)

                # Handle both string and list formats from Gemini
                if isinstance(content, list):
                    answer = ' '.join(block['text'] for block in content if isinstance(block, dict) and 'text' in block)
                else:
                    answer = content
            else:
                answer = "Could not generate a response."

            logger.info(f"Response generated successfully for session '{session_id}'")
            logger.debug(f"AI response: {answer[:200]}...")

            return answer

        except Exception as e:
            logger.error(f"Agent invocation failed: {e}", exc_info=True)
            return f"Error processing query: {str(e)}"

    async def process_message(
        self,
        message: str,
        session_id: str
    ) -> str:
        """Process a user message and generate a response.

        LangChain agent automatically:
        - Retrieves conversation history using session_id (thread_id)
        - Appends new message to history
        - Generates response with context
        - Saves updated history
        - Handles tool calls if tools are available

        Args:
            message: User's input message
            session_id: Unique session identifier (UUID from frontend)

        Returns:
            str: AI-generated response
        """
        return await self._invoke_async(message, session_id)
