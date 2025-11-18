"""FastAPI application configuration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def create_app() -> FastAPI:
    """Create and configure FastAPI application instance.

    Returns:
        FastAPI: Configured FastAPI application instance
    """
    app = FastAPI(
        title="mic-chatbot",
        description="Microservice to chat using LLM",
        version="0.1.0",
    )

    # Configure CORS - Allow all origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=True,
        allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allow all headers
    )

    # Register controllers/routers
    from mic_chatbot.infrastructure.controllers import health_controller, chat_controller
    app.include_router(health_controller.router)
    app.include_router(chat_controller.router)

    return app
