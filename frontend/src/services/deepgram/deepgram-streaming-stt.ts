/**
 * Deepgram Real-time Streaming Speech-to-Text
 * Uses Deepgram SDK for live transcription via WebSocket
 */

import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || "";

export interface StreamingTranscriptOptions {
	onTranscript: (text: string, isFinal: boolean) => void;
	onError?: (error: Error) => void;
	language?: string;
	model?: string;
}

/**
 * Real-time Speech-to-Text Streamer
 * Captures microphone audio and streams to Deepgram for live transcription
 */
export class DeepgramStreamingSTT {
	private deepgram: ReturnType<typeof createClient> | null = null;
	private connection: any = null;
	private mediaRecorder: MediaRecorder | null = null;
	private stream: MediaStream | null = null;
	private isActive = false;

	private onTranscript: (text: string, isFinal: boolean) => void;
	private onError?: (error: Error) => void;
	private language: string;
	private model: string;

	constructor(options: StreamingTranscriptOptions) {
		this.onTranscript = options.onTranscript;
		this.onError = options.onError;
		this.language = options.language || "es";
		this.model = options.model || "nova-2";

		if (!DEEPGRAM_API_KEY) {
			throw new Error("VITE_DEEPGRAM_API_KEY is not configured");
		}

		this.deepgram = createClient(DEEPGRAM_API_KEY);
	}

	/**
	 * Start streaming microphone audio to Deepgram
	 */
	async start(): Promise<void> {
		if (this.isActive) {
			console.warn("[DeepgramStreaming] Already active");
			return;
		}

		try {
			// Get microphone access
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 16000, // Deepgram optimized
					channelCount: 1, // Mono
				},
			});

			// Create Deepgram live transcription connection
			this.connection = this.deepgram!.listen.live({
				model: this.model,
				language: this.language,
				smart_format: true,
				punctuate: true,
				interim_results: true, // Get partial results while speaking
				endpointing: 300, // ms of silence to detect end of utterance
			});

			// Set up event listeners
			this.setupConnectionListeners();

			// Wait for connection to open
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error("Connection timeout"));
				}, 10000);

				this.connection.on(LiveTranscriptionEvents.Open, () => {
					clearTimeout(timeout);
					console.log("[DeepgramStreaming] Connection opened");
					resolve();
				});

				this.connection.on(LiveTranscriptionEvents.Error, (error: Error) => {
					clearTimeout(timeout);
					reject(error);
				});
			});

			// Start capturing and sending audio
			this.startAudioCapture();
			this.isActive = true;
		} catch (error) {
			this.cleanup();
			const err =
				error instanceof Error
					? error
					: new Error("Failed to start streaming");
			this.onError?.(err);
			throw err;
		}
	}

	/**
	 * Set up Deepgram connection event listeners
	 */
	private setupConnectionListeners(): void {
		if (!this.connection) return;

		// Handle transcription results
		this.connection.on(
			LiveTranscriptionEvents.Transcript,
			(data: any) => {
				const transcript = data.channel?.alternatives?.[0]?.transcript;
				const isFinal = data.is_final;

				if (transcript && transcript.trim().length > 0) {
					console.log(
						`[DeepgramStreaming] ${isFinal ? "Final" : "Interim"}:`,
						transcript,
					);
					this.onTranscript(transcript, isFinal);
				}
			},
		);

		// Handle errors
		this.connection.on(LiveTranscriptionEvents.Error, (error: Error) => {
			console.error("[DeepgramStreaming] Error:", error);
			this.onError?.(error);
		});

		// Handle close
		this.connection.on(LiveTranscriptionEvents.Close, () => {
			console.log("[DeepgramStreaming] Connection closed");
		});

		// Handle metadata (optional)
		this.connection.on(LiveTranscriptionEvents.Metadata, (data: any) => {
			console.log("[DeepgramStreaming] Metadata:", data);
		});
	}

	/**
	 * Start capturing microphone audio and send to Deepgram
	 */
	private startAudioCapture(): void {
		if (!this.stream || !this.connection) return;

		this.mediaRecorder = new MediaRecorder(this.stream, {
			mimeType: "audio/webm;codecs=opus",
		});

		this.mediaRecorder.ondataavailable = (event) => {
			if (
				event.data.size > 0 &&
				this.connection &&
				this.connection.getReadyState() === 1
			) {
				// Send audio chunk to Deepgram
				this.connection.send(event.data);
			}
		};

		// Send audio chunks every 250ms for smooth real-time transcription
		this.mediaRecorder.start(250);
	}

	/**
	 * Stop streaming and close connection
	 */
	async stop(): Promise<void> {
		if (!this.isActive) return;

		try {
			// Stop media recorder
			if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
				this.mediaRecorder.stop();
			}

			// Close Deepgram connection
			if (this.connection) {
				this.connection.finish();
			}

			this.cleanup();
			this.isActive = false;
		} catch (error) {
			console.error("[DeepgramStreaming] Error stopping:", error);
		}
	}

	/**
	 * Clean up resources
	 */
	private cleanup(): void {
		// Stop media tracks
		if (this.stream) {
			this.stream.getTracks().forEach((track) => track.stop());
			this.stream = null;
		}

		this.mediaRecorder = null;
		this.connection = null;
		this.isActive = false;
	}

	/**
	 * Check if currently streaming
	 */
	isStreaming(): boolean {
		return this.isActive;
	}

	/**
	 * Check if browser supports streaming
	 */
	static isSupported(): boolean {
		return !!(
			navigator.mediaDevices &&
			typeof navigator.mediaDevices.getUserMedia === "function" &&
			typeof MediaRecorder !== "undefined"
		);
	}
}
