/**
 * Voice Conversation Hook
 * Simple hook to manage voice conversation state and lifecycle
 * Follows React best practices - no unnecessary optimizations
 */

import { useEffect, useRef, useState } from "react";
import {
	VoiceConversation,
	type ConversationState,
} from "@/services/voice-conversation";
import { generateSessionId } from "@/services/chatbot/chatbot-api";

export function useVoiceConversation() {
	const [state, setState] = useState<ConversationState>("idle");
	const [transcript, setTranscript] = useState("");
	const [partialTranscript, setPartialTranscript] = useState("");
	const [response, setResponse] = useState("");
	const [error, setError] = useState<string | null>(null);

	const conversationRef = useRef<VoiceConversation | null>(null);

	// Initialize conversation service once
	useEffect(() => {
		conversationRef.current = new VoiceConversation({
			sessionId: generateSessionId(),
			onStateChange: (newState) => {
				setState(newState);
			},
			onTranscript: (text, isFinal) => {
				if (isFinal) {
					// Final transcript - this is what we'll send to the chatbot
					setTranscript(text);
					setPartialTranscript(""); // Clear partial when we get final
				} else {
					// Partial/interim transcript - show in real-time
					setPartialTranscript(text);
				}
			},
			onResponse: (text) => {
				setResponse(text);
			},
			onError: (err) => {
				setError(err.message);
				console.error("[VoiceConversation] Error:", err);
			},
		});

		// Cleanup on unmount
		return () => {
			if (conversationRef.current) {
				conversationRef.current.reset();
			}
		};
	}, []);

	// Simple function to start recording
	const startRecording = async () => {
		setError(null);
		setTranscript("");
		setPartialTranscript("");
		setResponse("");

		try {
			await conversationRef.current?.startRecording();
		} catch (err) {
			console.error("Failed to start recording:", err);
		}
	};

	// Simple function to stop recording and process
	const stopRecording = async () => {
		try {
			await conversationRef.current?.stopRecordingAndProcess();
		} catch (err) {
			console.error("Failed to process recording:", err);
		}
	};

	// Cancel current recording
	const cancel = () => {
		conversationRef.current?.cancelRecording();
		setError(null);
		setPartialTranscript("");
	};

	// Reset everything
	const reset = () => {
		conversationRef.current?.reset();
		setTranscript("");
		setPartialTranscript("");
		setResponse("");
		setError(null);
	};

	return {
		state,
		transcript,
		partialTranscript,
		response,
		error,
		startRecording,
		stopRecording,
		cancel,
		reset,
		isRecording: state === "recording",
		isProcessing: state === "thinking",
		isSpeaking: state === "speaking",
	};
}
