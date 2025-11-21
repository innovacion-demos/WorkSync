# mic-chatbot - AI Chatbot Microservice

Intelligent conversational agent microservice for WorkSync, built with FastAPI and LangChain/LangGraph. Provides AI-powered issue management through natural language interactions.

## Overview

The mic-chatbot service is a Python-based microservice that integrates with the WorkSync platform to provide conversational AI capabilities. It uses Google Gemini LLM through LangChain and connects to WorkSync's MCP (Model Context Protocol) server to perform issue management tasks.

## Architecture

This project follows **Hexagonal Architecture** (also known as Ports and Adapters or Clean Architecture) principles:

```
src/mic_chatbot/
├── domain/              # Business logic and entities
│   └── (domain models)
│
├── application/         # Use cases and application services
│   ├── services/
│   │   └── agent_service.py       # Agent service interface
│   └── use_cases/
│       └── send_message_to_chatbot_use_case.py
│
└── infrastructure/      # External adapters and frameworks
    ├── config/
    │   ├── dependencies.py         # Dependency injection
    │   ├── fastapi_config.py      # FastAPI setup
    │   └── logger.py              # Logging configuration
    ├── controllers/
    │   ├── chat_controller.py     # REST endpoints
    │   └── health_controller.py   # Health check
    └── services/
        └── langchain_agent_service.py  # LangChain implementation
```

### Architectural Principles

- **Domain Layer**: Pure business logic, framework-agnostic
- **Application Layer**: Use cases orchestrating domain logic
- **Infrastructure Layer**: Framework-specific implementations (FastAPI, LangChain)
- **Dependency Inversion**: High-level modules don't depend on low-level modules

## Technology Stack

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Package Manager**: uv
- **AI Framework**: LangChain 1.0.7+ & LangGraph 1.0.3+
- **LLM**: Google Gemini (via langchain-google-genai 3.0.3+)
- **MCP Integration**: langchain-mcp-adapters 0.1.13+
- **Server**: Uvicorn with standard extras

## Features

- **Natural Language Processing**: Understand and respond to user queries
- **Issue Management**: Create, list, and manage issues through conversation
- **MCP Tool Integration**: Connect to WorkSync MCP server for backend operations
- **Context-Aware Responses**: Maintain conversation history and context
- **LangGraph State Machine**: Robust conversation flow management
- **RESTful API**: FastAPI-based REST endpoints

## Getting Started

### Prerequisites

- Python 3.11 or higher
- uv package manager (recommended) or pip
- Access to Google Gemini API
- WorkSync MCP server running

### Installation

#### Using uv (Recommended)

```bash
# Navigate to the project directory
cd backend/mic-chatbot

# Install the package in development mode
uv pip install -e .
```

#### Using pip

```bash
cd backend/mic-chatbot
pip install -e .
```

### Configuration

Create a `.env` file in the project root:

```env
# Google Gemini API Configuration
GOOGLE_API_KEY=your_google_api_key_here

# MCP Server Configuration
MCP_SERVER_URL=http://localhost:8000
MCP_SERVER_NAME=worksync-mcp

# Server Configuration
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info

# Environment
ENVIRONMENT=development
```

### Running the Service

#### Method 1: Using the entry point

```bash
# Start the server
uv run start

# Or with python -m
python -m mic_chatbot.main
```

#### Method 2: Direct uvicorn

```bash
uvicorn mic_chatbot.infrastructure.config.fastapi_config:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at `http://localhost:8000`

## API Endpoints

### Chat Endpoint

**POST** `/chat`

Send a message to the chatbot and receive an AI-generated response.

**Request Body**:
```json
{
  "message": "Create an issue for fixing the login bug"
}
```

**Response**:
```json
{
  "response": "I've created an issue titled 'Fix login bug' with ID 123. The issue is now in OPEN status."
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "List all open issues"}'
```

### Health Check

**GET** `/health`

Check service health and status.

**Response**:
```json
{
  "status": "healthy",
  "service": "mic-chatbot",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

## LangChain Integration

### Agent Configuration

The chatbot uses a LangChain agent with:

- **LLM**: Google Gemini (gemini-pro)
- **Tools**: MCP tools from WorkSync server
- **Memory**: Conversation buffer for context
- **Graph**: LangGraph state machine for flow control

### MCP Tools

The agent has access to WorkSync tools via MCP:

1. **create_issue**: Create new issues
2. **list_issues**: List all issues
3. **get_issue**: Get issue details
4. **update_issue**: Update issue status/details
5. **delete_issue**: Delete issues

### Conversation Flow

```
User Message → LangChain Agent → Tool Selection → MCP Server → WorkSync API
                      ↓
                 Gemini LLM ← Tool Results ← MCP Response ← API Response
                      ↓
                User Response
```

## Development

### Project Structure

```
backend/mic-chatbot/
├── src/
│   └── mic_chatbot/
│       ├── __init__.py
│       ├── main.py                    # Entry point
│       ├── domain/                    # Business logic
│       ├── application/
│       │   ├── services/              # Service interfaces
│       │   └── use_cases/             # Application use cases
│       └── infrastructure/
│           ├── config/                # Configuration
│           ├── controllers/           # API controllers
│           └── services/              # External service implementations
│
├── pyproject.toml                     # Project metadata & dependencies
├── README.md
└── .env                              # Environment variables (not in git)
```

### Adding New Use Cases

1. Define the use case in `application/use_cases/`
2. Create interface in `application/services/` if needed
3. Implement in `infrastructure/services/`
4. Add controller endpoint in `infrastructure/controllers/`
5. Register dependencies in `infrastructure/config/dependencies.py`

### Extending the Agent

To add new capabilities:

1. **Add MCP Tools**: Extend the MCP server with new tools
2. **Update Agent**: Configure agent to use new tools
3. **Add Prompts**: Create system prompts for new functionality
4. **Test**: Test conversation flows

### Logging

The service uses Python's built-in logging with configuration in `infrastructure/config/logger.py`:

```python
import logging

logger = logging.getLogger(__name__)
logger.info("Processing chat request")
logger.error("Failed to connect to MCP server")
```

## Testing

```bash
# Install test dependencies
uv pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=mic_chatbot
```

### Test Structure

```python
# test_chat_controller.py
import pytest
from fastapi.testclient import TestClient

def test_chat_endpoint(client: TestClient):
    response = client.post("/chat", json={"message": "Hello"})
    assert response.status_code == 200
    assert "response" in response.json()
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install uv
RUN pip install uv

# Copy project files
COPY pyproject.toml .
COPY src/ src/

# Install dependencies
RUN uv pip install --system -e .

# Run the service
CMD ["python", "-m", "mic_chatbot.main"]
```

Build and run:

```bash
docker build -t mic-chatbot .
docker run -p 8000:8000 --env-file .env mic-chatbot
```

### Production Considerations

- Use environment variables for all configuration
- Enable HTTPS/TLS
- Implement rate limiting
- Add authentication/authorization
- Monitor with logging and metrics
- Use production-grade ASGI server (Uvicorn with Gunicorn)

```bash
# Production server
gunicorn mic_chatbot.infrastructure.config.fastapi_config:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | - | Yes |
| `MCP_SERVER_URL` | MCP server base URL | http://localhost:8000 | Yes |
| `MCP_SERVER_NAME` | MCP server name | worksync-mcp | No |
| `HOST` | Server host | 0.0.0.0 | No |
| `PORT` | Server port | 8000 | No |
| `LOG_LEVEL` | Logging level | info | No |
| `ENVIRONMENT` | Environment name | development | No |

## Troubleshooting

### Common Issues

**Import errors**
```bash
# Reinstall in development mode
uv pip install -e .
```

**MCP connection fails**
- Verify MCP server is running
- Check `MCP_SERVER_URL` in .env
- Test MCP server health endpoint

**Gemini API errors**
- Verify `GOOGLE_API_KEY` is valid
- Check API quota and limits
- Review Google Cloud Console logs

**Port already in use**
```bash
# Change port in .env or command line
PORT=8001 python -m mic_chatbot.main
```

## Dependencies Management

The project uses uv for fast, reliable dependency management:

```bash
# Add new dependency
uv pip install langchain-community

# Update all dependencies
uv pip install --upgrade-package "*"

# Show installed packages
uv pip list
```

## Best Practices

### Code Organization

- Keep domain logic independent of frameworks
- Use dependency injection for testability
- Follow single responsibility principle
- Write comprehensive docstrings

### LangChain Usage

- Keep prompts clear and specific
- Handle tool errors gracefully
- Implement retry logic for LLM calls
- Monitor token usage

### API Design

- Use Pydantic models for request/response validation
- Provide clear error messages
- Include request/response examples in docs
- Version your API endpoints

## Contributing

1. Follow hexagonal architecture principles
2. Use type hints for all functions
3. Write unit tests for new features
4. Update this README for significant changes
5. Use meaningful commit messages

## Architecture Guidelines

See `CLAUDE.md` for detailed architecture guidelines:

- Use uv as package manager
- LangChain/LangGraph for LLM interactions
- FastAPI for REST endpoints
- Maintain hexagonal architecture structure

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [LangChain Documentation](https://python.langchain.com)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Google Gemini API](https://ai.google.dev/docs)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Built with Python, FastAPI, and LangChain for intelligent conversations**