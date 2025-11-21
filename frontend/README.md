# WorkSync Frontend

Modern React-based frontend for the WorkSync issue tracking system, featuring real-time updates, voice interactions, and an AI-powered chatbot interface.

## Overview

The WorkSync frontend is a cutting-edge single-page application built with React 19, TypeScript, and Vite. It provides an intuitive interface for managing issues with advanced features like voice commands and real-time collaboration.

## Technology Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.1.7
- **Runtime**: Bun (latest)
- **Styling**: Tailwind CSS 4.1.17
- **State Management**: Zustand 5.0.8
- **Code Quality**: Biome (formatting & linting)

### Key Dependencies

- **@deepgram/sdk** (4.11.2) - Speech-to-text and text-to-speech
- **@stomp/stompjs** (7.2.1) - WebSocket communication
- **sockjs-client** (1.6.1) - WebSocket fallback
- **swapy** (1.0.5) - Drag-and-drop interface
- **reselect** (5.1.1) - Memoized selectors

## Getting Started

### Prerequisites

- **Bun**: Latest version (https://bun.sh)
- **Node.js**: v18+ (as fallback)

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# The app will be available at http://localhost:5173
```

### Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Code Quality

```bash
# Format code
bun run format

# Lint code
bun run lint

# Check and auto-fix issues
bun run check
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── floating-chat.tsx       # Floating chatbot interface
│   │   ├── voice-assistant/        # Voice assistant components
│   │   │   ├── voice-assistant.tsx # Main voice UI
│   │   │   └── voice-orb.tsx      # Animated voice orb
│   │   └── hooks/                  # Custom React hooks
│   │       └── use-voice-conversation.ts
│   │
│   ├── features/            # Feature-based modules
│   │   └── issues/
│   │       ├── components/         # Issue-specific components
│   │       │   ├── issues-header.tsx
│   │       │   ├── issues-table.tsx
│   │       │   └── modals/
│   │       ├── types/              # TypeScript types
│   │       ├── utils/              # Utilities & event handlers
│   │       └── views/              # Page-level views
│   │
│   ├── services/            # External service integrations
│   │   ├── deepgram/               # Deepgram STT/TTS services
│   │   │   ├── deepgram-stt.ts
│   │   │   ├── deepgram-streaming-stt.ts
│   │   │   └── deepgram-streaming-tts.ts
│   │   └── voice-conversation.ts   # Voice conversation orchestration
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
│
├── public/                  # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── biome.json              # Biome configuration
```

## Features

### 1. Issue Management

Comprehensive issue tracking with real-time updates:

- **Issues Table**: Sortable, filterable table view of all issues
- **Issue Creation**: Multiple creation methods (form, text, voice)
- **Issue Updates**: Real-time status changes via WebSocket
- **Issue Details**: Detailed view with full information

**Key Components**:
- `issues-table.tsx`: Main table component with sorting and filtering
- `issues-header.tsx`: Action buttons and filters
- `all-issues-view.tsx`: Main issues page layout

### 2. Voice Assistant

Hands-free issue management using Deepgram:

- **Voice Commands**: Create issues using natural language
- **Real-time STT**: Streaming speech-to-text recognition
- **TTS Responses**: Natural voice responses
- **Visual Feedback**: Animated voice orb with state indication

**Key Components**:
- `voice-assistant.tsx`: Main voice interface
- `voice-orb.tsx`: Animated orb visualization
- `use-voice-conversation.ts`: Voice conversation management hook

**Voice Services**:
- `deepgram-streaming-stt.ts`: Streaming speech recognition
- `deepgram-streaming-tts.ts`: Streaming text-to-speech
- `voice-conversation.ts`: Conversation orchestration

### 3. AI Chatbot

Floating chat interface with AI-powered assistance:

- **Conversational UI**: Natural language interaction
- **Context Awareness**: Maintains conversation history
- **Issue Integration**: Direct issue creation from chat
- **Floating Widget**: Non-intrusive overlay interface

**Key Component**:
- `floating-chat.tsx`: Main chatbot interface

### 4. Real-time Updates

WebSocket-based live data synchronization:

- **Automatic Updates**: Issues update across all clients instantly
- **Event Handling**: Robust event processing
- **Connection Management**: Automatic reconnection

**Key Files**:
- `websocket-event-handlers.ts`: WebSocket event processing

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Deepgram API Key for voice features
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key

# Backend API URLs
VITE_API_BASE_URL=http://localhost:8080
VITE_CHATBOT_API_URL=http://localhost:8000

# WebSocket URL
VITE_WS_URL=http://localhost:8080/ws
```

### Vite Configuration

The `vite.config.ts` file includes:
- React plugin with Babel compiler
- Tailwind CSS via Vite plugin
- Development server settings
- Build optimizations

## TypeScript

The project uses strict TypeScript configuration:

- **Strict Mode**: Enabled for maximum type safety
- **Module**: ES2020
- **Target**: ES2020
- **JSX**: React JSX transform
- **Path Aliases**: Configured for clean imports

### Type Definitions

Key type files:
- `features/issues/types/issue.d.ts`: Issue-related types

## Styling

### Tailwind CSS 4.x

The project uses the latest Tailwind CSS with:
- **Vite Plugin**: `@tailwindcss/vite` for optimal performance
- **Custom Styles**: Defined in `index.css`
- **Component Utilities**: Utility-first approach
- **Responsive Design**: Mobile-first responsive layouts

### Design System

- **Colors**: Custom color palette
- **Typography**: Responsive text scales
- **Spacing**: Consistent spacing system
- **Animations**: Smooth transitions and animations

## State Management

### Zustand

Lightweight state management for:
- Issue list state
- Chatbot conversation state
- Voice assistant state
- WebSocket connection state

## Custom Hooks

### `use-voice-conversation.ts`

Manages voice conversation lifecycle:
- Speech recognition state
- TTS playback state
- Conversation flow
- Error handling

## WebSocket Integration

### STOMP over WebSocket

Real-time communication using STOMP protocol:

```typescript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Connection setup
const client = new Client({
  webSocketFactory: () => new SockJS('/ws'),
  onConnect: () => {
    client.subscribe('/topic/issues', handleMessage);
  }
});
```

## Best Practices

### Code Organization

- **Feature-based structure**: Related code grouped by feature
- **Separation of concerns**: Components, services, and utilities separated
- **Type safety**: Comprehensive TypeScript coverage
- **Reusable components**: Shared components in `/components`

### Performance

- **Code splitting**: Dynamic imports for route-based splitting
- **Memoization**: React.memo and useMemo for expensive computations
- **Lazy loading**: Components loaded on demand
- **Optimized builds**: Vite's optimized production builds

### Code Quality

- **Biome**: Fast, modern linter and formatter
- **TypeScript**: Strict type checking
- **Consistent formatting**: Automated with Biome
- **ESLint**: Additional linting rules

## Development Workflow

### Adding New Features

1. Create feature directory in `src/features/`
2. Add components in `components/`
3. Define types in `types/`
4. Implement services in `services/`
5. Create views in `views/`

### Adding Voice Commands

1. Extend voice service in `services/voice-conversation.ts`
2. Add command processing logic
3. Update UI feedback in `voice-assistant.tsx`
4. Test with Deepgram streaming

### Integrating with Backend

1. Define API endpoints in service files
2. Use fetch or httpx for requests
3. Handle WebSocket events in event handlers
4. Update Zustand stores with responses

## Testing

```bash
# Run tests (when configured)
bun test

# Run tests in watch mode
bun test --watch
```

## Troubleshooting

### Common Issues

**Vite dev server won't start**
- Check if port 5173 is available
- Clear Vite cache: `rm -rf node_modules/.vite`

**WebSocket connection fails**
- Verify backend is running
- Check WebSocket URL in environment variables
- Ensure CORS is properly configured

**Voice features not working**
- Verify Deepgram API key is set
- Check browser permissions for microphone
- Ensure HTTPS in production (required for audio)

**Build fails**
- Clear build cache: `rm -rf dist`
- Reinstall dependencies: `rm -rf node_modules && bun install`

## Performance Optimization

### Production Build

```bash
# Build with optimizations
bun run build

# Analyze bundle size
bunx vite-bundle-visualizer
```

### Lazy Loading

Components are lazy loaded for optimal initial load:

```typescript
const IssueDetails = lazy(() => import('./features/issues/components/IssueDetails'));
```

## Browser Support

- **Chrome/Edge**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions

## Contributing

1. Follow the established project structure
2. Use TypeScript for all new files
3. Run `bun run check` before committing
4. Write meaningful commit messages
5. Keep components small and focused

## Learn More

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Deepgram](https://developers.deepgram.com)

---

**Built with React 19, Vite, and modern web technologies**
