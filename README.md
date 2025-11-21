# WorkSync

A modern, full-stack issue tracking and management system with AI-powered voice assistant capabilities. WorkSync combines a React frontend with multiple microservices to provide an intelligent, interactive project management experience.

## Overview

WorkSync is a comprehensive issue management platform that integrates:

- **Real-time Issue Tracking**: Create, update, and manage issues with WebSocket-based live updates
- **AI-Powered Chatbot**: LangChain/LangGraph-based conversational agent for issue management
- **Voice Assistant**: Deepgram-powered voice interactions for hands-free operation
- **MCP Integration**: Model Context Protocol server for seamless AI tool integration

## Architecture

```
WorkSync/
├── frontend/              # React + TypeScript + Vite frontend
├── backend/
│   ├── mic_issues/       # Spring Boot main API service
│   └── mic-chatbot/      # Python FastAPI LLM chatbot service
└── mcp/                  # Model Context Protocol server
```

### Technology Stack

#### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand
- **Real-time**: STOMP WebSocket client
- **Voice**: Deepgram SDK for STT/TTS
- **Runtime**: Bun

#### Backend - mic_issues
- **Framework**: Spring Boot 3.5.x
- **Language**: Java 25
- **Database**: PostgreSQL
- **Communication**: WebSocket (STOMP)
- **Build**: Maven

#### Backend - mic-chatbot
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI Framework**: LangChain + LangGraph
- **LLM**: Google Gemini (via langchain-google-genai)
- **Architecture**: Hexagonal/Clean Architecture
- **Package Manager**: uv

#### MCP Server
- **Framework**: FastMCP
- **Language**: Python 3.12+
- **Purpose**: Expose WorkSync API as MCP tools

## Quick Start

### Prerequisites

- **Node.js/Bun**: For frontend development
- **Java 25**: For mic_issues backend
- **Python 3.11+**: For mic-chatbot
- **Python 3.12+**: For MCP server
- **PostgreSQL**: Database for mic_issues
- **Docker** (optional): For containerized deployment

### Installation

#### 1. Frontend

```bash
cd frontend
bun install
bun run dev
```

The frontend will be available at `http://localhost:5173`

#### 2. Backend - mic_issues

```bash
cd backend/mic_issues
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`

#### 3. Backend - mic-chatbot

```bash
cd backend/mic-chatbot
uv pip install -e .
python -m mic_chatbot.main
```

The chatbot API will be available at `http://localhost:8000`

#### 4. MCP Server

```bash
cd mcp
uv pip install -e .
python -m worksync_mcp.main
```

## Features

### Issue Management
- Create, read, update, and delete issues
- Real-time updates via WebSocket
- Advanced filtering and search
- Issue status tracking (OPEN, IN_PROGRESS, DONE)

### AI Chatbot
- Natural language issue creation and management
- Context-aware conversations using LangGraph
- Integration with WorkSync MCP tools
- Powered by Google Gemini

### Voice Assistant
- Voice-activated issue creation
- Real-time speech-to-text using Deepgram
- Natural language processing
- Text-to-speech responses

### Real-time Collaboration
- Live issue updates across all connected clients
- WebSocket-based event streaming
- Instant notification of changes

## Project Structure

### Frontend (`/frontend`)
- Component-based React architecture
- Feature-based organization
- TypeScript for type safety
- Tailwind CSS for styling
- See [frontend/README.md](frontend/README.md) for details

### Backend - mic_issues (`/backend/mic_issues`)
- Spring Boot REST API
- JPA/Hibernate for data persistence
- PostgreSQL database
- WebSocket support for real-time updates
- See [backend/mic_issues/README.md](backend/mic_issues/README.md) for details

### Backend - mic-chatbot (`/backend/mic-chatbot`)
- Hexagonal architecture
- LangChain agent with MCP tool integration
- FastAPI REST endpoints
- Google Gemini LLM
- See [backend/mic-chatbot/README.md](backend/mic-chatbot/README.md) for details

### MCP Server (`/mcp`)
- FastMCP-based tool server
- Exposes WorkSync API as MCP tools
- Clean architecture with separated concerns
- See [mcp/README.md](mcp/README.md) for details

## Development

### Running in Development Mode

1. Start PostgreSQL database
2. Start mic_issues backend
3. Start mic-chatbot backend
4. Start frontend development server
5. (Optional) Start MCP server for AI integrations

### Environment Variables

Each component may require specific environment variables. Check individual README files for details:

- **Frontend**: API endpoints, Deepgram API key
- **mic_issues**: Database connection, server port
- **mic-chatbot**: Google API key, MCP server URL
- **MCP**: WorkSync API base URL

## API Documentation

### mic_issues REST API
- `GET /api/issues` - List all issues
- `POST /api/issues` - Create new issue
- `GET /api/issues/{id}` - Get issue details
- `PUT /api/issues/{id}` - Update issue
- `DELETE /api/issues/{id}` - Delete issue

### mic-chatbot API
- `POST /chat` - Send message to chatbot
- `GET /health` - Health check

### WebSocket Events
- `/ws/issues` - Subscribe to real-time issue updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software developed by CaixaBank Tech.

## Support

For issues, questions, or contributions, please contact the development team.

---

**Built with excellence by the WorkSync Team**
