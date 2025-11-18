/**
 * Chatbot Service Types
 * Type definitions for the chatbot API integration
 */

/**
 * Request payload for sending a message to the chatbot
 */
export interface ChatRequest {
	message: string;
}

/**
 * Response from the chatbot API
 */
export interface ChatResponse {
	answer: string;
}

/**
 * Health check response from chatbot service
 */
export interface HealthResponse {
	status: string;
	service: string;
	version: string;
}

/**
 * Error response from the API
 */
export interface ChatbotError {
	message: string;
	code?: string;
	details?: unknown;
}
