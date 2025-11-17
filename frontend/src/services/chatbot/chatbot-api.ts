/**
 * Chatbot API Service
 * Handles all communication with the mic-chatbot backend
 */

import { CHATBOT_CONFIG, ENDPOINTS } from "../config";
import type { ChatRequest, ChatResponse, HealthResponse } from "./chatbot-types";

/**
 * Send a message to the chatbot and get AI response
 * @param sessionId - Unique session identifier for conversation context
 * @param message - User's message text
 * @returns Promise with the AI's response
 */
export async function sendChatMessage(
	sessionId: string,
	message: string,
): Promise<string> {
	try {
		const url = `${CHATBOT_CONFIG.BASE_URL}${ENDPOINTS.CHATBOT.CHAT(sessionId)}`;

		const requestBody: ChatRequest = {
			message,
		};

		const controller = new AbortController();
		const timeoutId = setTimeout(
			() => controller.abort(),
			CHATBOT_CONFIG.TIMEOUT,
		);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`[ChatbotAPI] Error response from server (${response.status}):`,
				errorText,
			);
			throw new Error(
				`Failed to send message: ${response.status} ${response.statusText}`,
			);
		}

		const data: ChatResponse = await response.json();

		if (!data.answer) {
			console.error("[ChatbotAPI] Invalid response format:", data);
			throw new Error("Invalid response from chatbot");
		}

		return data.answer;
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				console.error("[ChatbotAPI] Request timeout");
				throw new Error(
					"The chatbot is taking too long to respond. Please try again.",
				);
			}
			console.error("[ChatbotAPI] Error sending message:", error.message);
			throw error;
		}
		throw new Error("Unknown error occurred while sending message");
	}
}

/**
 * Check if the chatbot service is healthy and available
 * @returns Promise with health status
 */
export async function checkChatbotHealth(): Promise<HealthResponse> {
	try {
		const url = `${CHATBOT_CONFIG.BASE_URL}${ENDPOINTS.CHATBOT.HEALTH}`;

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Health check failed: ${response.status}`);
		}

		const data: HealthResponse = await response.json();
		return data;
	} catch (error) {
		console.error("[ChatbotAPI] Health check failed:", error);
		throw error;
	}
}

/**
 * Generate a unique session ID for conversation tracking
 * Uses UUID v4 format for consistency with backend expectations
 * @returns UUID string
 */
export function generateSessionId(): string {
	return crypto.randomUUID();
}
