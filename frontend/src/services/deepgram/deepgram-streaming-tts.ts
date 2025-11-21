/**
 * Deepgram Streaming Text-to-Speech
 * Streams audio chunks for faster playback (no need to wait for full audio)
 */

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || "";
const DEEPGRAM_TTS_URL = "https://api.deepgram.com/v1/speak";

interface StreamingTTSOptions {
	text: string;
	model?: string;
	onAudioChunk?: (chunk: Uint8Array) => void;
	onComplete?: () => void;
	onError?: (error: Error) => void;
}

/**
 * Stream text-to-speech with progressive audio playback
 * Uses MediaSource API for playing audio as it arrives
 */
export async function streamTextToSpeech({
	text,
	model = "aura-2-nestor-es",
	onAudioChunk,
	onComplete,
	onError,
}: StreamingTTSOptions): Promise<void> {
	if (!DEEPGRAM_API_KEY) {
		throw new Error("VITE_DEEPGRAM_API_KEY is not configured");
	}

	try {
		// Make streaming request to Deepgram
		const response = await fetch(`${DEEPGRAM_TTS_URL}?model=${model}`, {
			method: "POST",
			headers: {
				Authorization: `Token ${DEEPGRAM_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		});

		if (!response.ok) {
			throw new Error(`Deepgram TTS failed (${response.status})`);
		}

		// Check if response supports streaming
		if (!response.body) {
			throw new Error("Response body is not readable");
		}

		// Read stream chunks
		const reader = response.body.getReader();
		const chunks: Uint8Array[] = [];

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				console.log("[StreamingTTS] Stream complete");
				onComplete?.();
				break;
			}

			if (value) {
				chunks.push(value);
				onAudioChunk?.(value);
			}
		}
	} catch (error) {
		const err = error instanceof Error ? error : new Error("Streaming TTS failed");
		console.error("[StreamingTTS] Error:", err);
		onError?.(err);
		throw err;
	}
}

/**
 * Play streaming audio using MediaSource API
 * Allows playing audio progressively as chunks arrive
 */
export class StreamingAudioPlayer {
	private audio: HTMLAudioElement | null = null;
	private mediaSource: MediaSource | null = null;
	private sourceBuffer: SourceBuffer | null = null;
	private chunks: Uint8Array[] = [];
	private isAppending = false;

	/**
	 * Initialize MediaSource for progressive playback
	 */
	async initialize(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				// Check if MediaSource is supported
				if (!("MediaSource" in window)) {
					throw new Error("MediaSource API is not supported in this browser");
				}

				this.mediaSource = new MediaSource();
				this.audio = new Audio();
				this.audio.src = URL.createObjectURL(this.mediaSource);

				this.mediaSource.addEventListener("sourceopen", () => {
					try {
						// Use audio/mpeg for MP3 format (Deepgram default)
						this.sourceBuffer = this.mediaSource!.addSourceBuffer("audio/mpeg");

						this.sourceBuffer.addEventListener("updateend", () => {
							this.isAppending = false;
							this.processNextChunk();
						});

						console.log("[StreamingAudioPlayer] Initialized");
						resolve();
					} catch (error) {
						reject(error);
					}
				});

				this.mediaSource.addEventListener("error", (e) => {
					console.error("[StreamingAudioPlayer] MediaSource error:", e);
					reject(new Error("MediaSource error"));
				});
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Add audio chunk to buffer and play
	 */
	addChunk(chunk: Uint8Array): void {
		this.chunks.push(chunk);
		this.processNextChunk();
	}

	/**
	 * Process next chunk in queue
	 */
	private processNextChunk(): void {
		if (
			this.isAppending ||
			this.chunks.length === 0 ||
			!this.sourceBuffer ||
			this.sourceBuffer.updating
		) {
			return;
		}

		this.isAppending = true;
		const chunk = this.chunks.shift()!;

		try {
			this.sourceBuffer.appendBuffer(chunk);

			// Start playing once we have some data buffered
			if (this.audio && this.audio.paused && this.audio.readyState >= 2) {
				this.audio.play().catch((error) => {
					console.error("[StreamingAudioPlayer] Play error:", error);
				});
			}
		} catch (error) {
			console.error("[StreamingAudioPlayer] Error appending buffer:", error);
			this.isAppending = false;
		}
	}

	/**
	 * Finish streaming and close MediaSource
	 */
	finish(): void {
		if (this.mediaSource && this.mediaSource.readyState === "open") {
			// Wait for all chunks to be processed
			if (this.chunks.length === 0 && !this.isAppending) {
				this.mediaSource.endOfStream();
			}
		}
	}

	/**
	 * Wait for audio to finish playing
	 */
	async waitForCompletion(): Promise<void> {
		return new Promise((resolve) => {
			if (!this.audio) {
				resolve();
				return;
			}

			this.audio.addEventListener("ended", () => {
				resolve();
			});
		});
	}

	/**
	 * Stop and cleanup
	 */
	stop(): void {
		if (this.audio) {
			this.audio.pause();
			this.audio.currentTime = 0;
		}
		this.cleanup();
	}

	/**
	 * Cleanup resources
	 */
	private cleanup(): void {
		if (this.audio && this.audio.src) {
			URL.revokeObjectURL(this.audio.src);
		}

		this.audio = null;
		this.mediaSource = null;
		this.sourceBuffer = null;
		this.chunks = [];
		this.isAppending = false;
	}
}

/**
 * High-level function to play streaming TTS audio
 * Simplifies usage with automatic setup and teardown
 */
export async function playStreamingTextToSpeech(
	text: string,
	model = "aura-2-nestor-es"
): Promise<void> {
	const player = new StreamingAudioPlayer();

	try {
		// Initialize MediaSource player
		await player.initialize();

		// Start streaming TTS
		await streamTextToSpeech({
			text,
			model,
			onAudioChunk: (chunk) => {
				player.addChunk(chunk);
			},
			onComplete: () => {
				player.finish();
			},
			onError: (error) => {
				console.error("[StreamingTTS] Error:", error);
				player.stop();
			},
		});

		// Wait for playback to complete
		await player.waitForCompletion();
		player.stop();
	} catch (error) {
		player.stop();
		throw error;
	}
}

/**
 * Simple blob-based streaming (fallback for browsers without MediaSource)
 * Collects all chunks and plays as single blob
 */
export async function streamTextToSpeechFallback(
	text: string,
	model = "aura-2-nestor-es"
): Promise<void> {
	const chunks: Uint8Array[] = [];

	await streamTextToSpeech({
		text,
		model,
		onAudioChunk: (chunk) => {
			chunks.push(chunk);
		},
	});

	// Combine all chunks into single blob
	const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
	const audioUrl = URL.createObjectURL(audioBlob);
	const audio = new Audio(audioUrl);

	return new Promise((resolve, reject) => {
		audio.onended = () => {
			URL.revokeObjectURL(audioUrl);
			resolve();
		};
		audio.onerror = () => {
			URL.revokeObjectURL(audioUrl);
			reject(new Error("Audio playback failed"));
		};
		audio.play().catch(reject);
	});
}
