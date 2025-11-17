"""Main entry point for the mic-chatbot service."""

import uvicorn
from mic_chatbot.infrastructure.config.fastapi_config import create_app


def main():
    """Start the FastAPI server."""
    app = create_app()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )


if __name__ == "__main__":
    main()
