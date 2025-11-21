/**
 * Voice Conversation Manager
 * Orchestrates the full voice conversation flow: Real-time STT → Chatbot → Streaming TTS
 */

import { DeepgramStreamingSTT } from "./deepgram/deepgram-streaming-stt";
import { playTextToSpeech } from "./deepgram/deepgram-tts";
import { playStreamingTextToSpeech } from "./deepgram/deepgram-streaming-tts";
import { sendChatMessage } from "./chatbot/chatbot-api";

export type ConversationState =
	| "idle"
	| "recording"
	| "thinking"
	| "speaking"
	| "error";

export interface VoiceConversationOptions {
	sessionId: string;
	onStateChange?: (state: ConversationState) => void;
	onTranscript?: (text: string, isFinal: boolean) => void;
	onResponse?: (text: string) => void;
	onError?: (error: Error) => void;
}

/**
 * Voice Conversation Manager Class
 * Manages the complete voice interaction lifecycle with real-time streaming
 */
export class VoiceConversation {
	private streamer: DeepgramStreamingSTT | null = null;
	private sessionId: string;
	private state: ConversationState = "idle";
	private currentAudio: HTMLAudioElement | null = null;
	private finalTranscripts: string[] = []; // Collect all final transcripts

	// Callbacks
	private onStateChange?: (state: ConversationState) => void;
	private onTranscript?: (text: string, isFinal: boolean) => void;
	private onResponse?: (text: string) => void;
	private onError?: (error: Error) => void;

	constructor(options: VoiceConversationOptions) {
		this.sessionId = options.sessionId;
		this.onStateChange = options.onStateChange;
		this.onTranscript = options.onTranscript;
		this.onResponse = options.onResponse;
		this.onError = options.onError;
	}

	/**
	 * Get current conversation state
	 */
	getState(): ConversationState {
		return this.state;
	}

	/**
	 * Update state and notify listeners
	 */
	private setState(newState: ConversationState): void {
		this.state = newState;
		this.onStateChange?.(newState);
	}

	/**
	 * Start real-time streaming transcription
	 */
	async startRecording(): Promise<void> {
		try {
			if (this.state !== "idle") {
				throw new Error(`Cannot start recording in state: ${this.state}`);
			}

			this.finalTranscripts = []; // Reset transcripts
			this.setState("recording");

			// Create streaming STT instance
			this.streamer = new DeepgramStreamingSTT({
				onTranscript: (text, isFinal) => {
					// Send partial and final transcripts to UI
					this.onTranscript?.(text, isFinal);

					// Collect final transcripts
					if (isFinal && text.trim().length > 0) {
						console.log("[VoiceConversation] Adding final transcript:", text);
						this.finalTranscripts.push(text);
					}
				},
				onError: (error) => {
					console.error("[VoiceConversation] Streaming error:", error);
					this.onError?.(error);
				},
			});

			// Start streaming
			await this.streamer.start();
			console.log("[VoiceConversation] Streaming started");
		} catch (error) {
			this.setState("error");
			const err =
				error instanceof Error
					? error
					: new Error("Failed to start recording");
			this.onError?.(err);

			// Return to idle after error
			setTimeout(() => {
				if (this.state === "error") {
					this.setState("idle");
				}
			}, 2000);

			throw err;
		}
	}

	/**
	 * Stop streaming and process the conversation
	 */
	async stopRecordingAndProcess(): Promise<void> {
		try {
			if (this.state !== "recording") {
				throw new Error(`Cannot stop recording in state: ${this.state}`);
			}

			// Step 1: Stop streaming
			await this.streamer?.stop();
			this.streamer = null;

			// Step 2: Wait for final transcripts to arrive
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Step 3: Combine all final transcripts
			const fullTranscript = this.finalTranscripts.join(" ").trim();

			console.log(
				"[VoiceConversation] Final transcripts collected:",
				this.finalTranscripts,
			);
			console.log("[VoiceConversation] Full transcript:", fullTranscript);

			// Step 4: Check if we got any transcript
			if (!fullTranscript || fullTranscript.length === 0) {
				throw new Error("No se detectó voz. Por favor, intenta de nuevo.");
			}

			// Step 5: Send to chatbot API
			this.setState("thinking");
			const aiResponse = await sendChatMessage(this.sessionId, fullTranscript);

			console.log("[VoiceConversation] AI Response:", aiResponse);
			this.onResponse?.(aiResponse);

			// Step 6: Convert response to speech with STREAMING TTS (faster!)
			this.setState("speaking");
			try {
				// Try streaming TTS first (faster, lower latency)
				await playStreamingTextToSpeech(aiResponse);
			} catch (error) {
				console.warn("[VoiceConversation] Streaming TTS failed, falling back to regular TTS:", error);
				// Fallback to regular TTS if streaming fails
				await playTextToSpeech(aiResponse);
			}

			// Done - back to idle
			this.setState("idle");
		} catch (error) {
			this.setState("error");
			const err =
				error instanceof Error ? error : new Error("Conversation failed");
			this.onError?.(err);

			// Return to idle after error
			setTimeout(() => {
				if (this.state === "error") {
					this.setState("idle");
				}
			}, 2000);

			throw err;
		}
	}

	/**
	 * Cancel current recording without processing
	 */
	cancelRecording(): void {
		if (this.state === "recording" && this.streamer) {
			this.streamer.stop();
			this.streamer = null;
			this.finalTranscripts = [];
			this.setState("idle");
		}
	}

	/**
	 * Stop any currently playing audio
	 */
	stopSpeaking(): void {
		if (this.currentAudio) {
			this.currentAudio.pause();
			this.currentAudio.currentTime = 0;
			this.currentAudio = null;
		}

		if (this.state === "speaking") {
			this.setState("idle");
		}
	}

	/**
	 * Reset conversation to idle state
	 */
	reset(): void {
		this.cancelRecording();
		this.stopSpeaking();
		this.finalTranscripts = [];
		this.setState("idle");
	}

	/**
	 * Check if the browser supports voice conversations
	 */
	static isSupported(): boolean {
		return DeepgramStreamingSTT.isSupported();
	}
}

/**
 * Create a new voice conversation instance
 */
export function createVoiceConversation(
	options: VoiceConversationOptions,
): VoiceConversation {
	if (!VoiceConversation.isSupported()) {
		throw new Error(
			"Voice conversations are not supported in this browser. Please use a modern browser like Chrome, Edge, or Firefox.",
		);
	}

	return new VoiceConversation(options);
}
