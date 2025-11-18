/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
	BASE_URL: "http://localhost:8080/api",
	TIMEOUT: 10000,
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000,
} as const;

export const CHATBOT_CONFIG = {
	BASE_URL: "http://localhost:8000",
	TIMEOUT: 30000, // 30s for AI responses
} as const;

/**
 * API Endpoints
 */
export const ENDPOINTS = {
	ISSUES: {
		BASE: "/issues",
		BY_ID: (id: number) => `/issues/${id}`,
		ASSIGN: (id: number) => `/issues/${id}/assign`,
		UNASSIGN: (id: number) => `/issues/${id}/unassign`,
		STATUS: (id: number) => `/issues/${id}/status`,
	},
	USERS: {
		BASE: "/users",
		BY_ID: (id: number) => `/users/${id}`,
		BY_DEPARTMENT: (department: string) =>
			`/users?department=${encodeURIComponent(department)}`,
	},
	CHATBOT: {
		HEALTH: "/health",
		CHAT: (sessionId: string) => `/api/v1/chat/${sessionId}`,
	},
} as const;
