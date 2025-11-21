/**
 * Deepgram Speech-to-Text (STT) Service
 * Handles audio recording and transcription using Deepgram API
 */

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || "";
const DEEPGRAM_STT_URL = "https://api.deepgram.com/v1/listen";

interface DeepgramSTTOptions {
	audioBlob: Blob;
	language?: string;
	model?: string;
}

interface DeepgramSTTResponse {
	results: {
		channels: Array<{
			alternatives: Array<{
				transcript: string;
				confidence: number;
			}>;
		}>;
	};
}

/**
 * Transcribe audio to text using Deepgram API
 * @param options - Audio blob and configuration options
 * @returns Transcribed text
 */
export async function speechToText({
	audioBlob,
	language = "es",
	model = "nova-2",
}: DeepgramSTTOptions): Promise<string> {
	if (!DEEPGRAM_API_KEY) {
		throw new Error("VITE_DEEPGRAM_API_KEY is not configured");
	}

	const params = new URLSearchParams({
		model,
		language,
		punctuate: "true",
		smart_format: "true",
	});

	const response = await fetch(`${DEEPGRAM_STT_URL}?${params}`, {
		method: "POST",
		headers: {
			Authorization: `Token ${DEEPGRAM_API_KEY}`,
			"Content-Type": audioBlob.type || "audio/webm",
		},
		body: audioBlob,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Deepgram STT failed (${response.status}): ${errorText}`,
		);
	}

	const data: DeepgramSTTResponse = await response.json();
	const transcript =
		data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";

	if (!transcript) {
		throw new Error("No transcription received from Deepgram");
	}

	return transcript.trim();
}

/**
 * Audio Recorder class to handle browser audio recording
 */
export class AudioRecorder {
	private mediaRecorder: MediaRecorder | null = null;
	private audioChunks: Blob[] = [];
	private stream: MediaStream | null = null;

	/**
	 * Start recording audio from microphone
	 */
	async startRecording(): Promise<void> {
		try {
			this.stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					sampleRate: 44100,
				},
			});

			this.mediaRecorder = new MediaRecorder(this.stream, {
				mimeType: "audio/webm",
			});

			this.audioChunks = [];

			this.mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					this.audioChunks.push(event.data);
				}
			};

			this.mediaRecorder.start();
		} catch (error) {
			console.error("Failed to start recording:", error);
			throw new Error(
				"Could not access microphone. Please check your permissions.",
			);
		}
	}

	/**
	 * Stop recording and return the audio blob
	 */
	async stopRecording(): Promise<Blob> {
		return new Promise((resolve, reject) => {
			if (!this.mediaRecorder) {
				reject(new Error("No active recording"));
				return;
			}

			this.mediaRecorder.onstop = () => {
				const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
				this.cleanup();
				resolve(audioBlob);
			};

			this.mediaRecorder.stop();
		});
	}

	/**
	 * Cancel recording without returning audio
	 */
	cancel(): void {
		if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
			this.mediaRecorder.stop();
		}
		this.cleanup();
	}

	/**
	 * Clean up resources
	 */
	private cleanup(): void {
		if (this.stream) {
			this.stream.getTracks().forEach((track) => track.stop());
			this.stream = null;
		}
		this.mediaRecorder = null;
		this.audioChunks = [];
	}

	/**
	 * Check if browser supports audio recording
	 */
	static isSupported(): boolean {
		return !!(
			navigator.mediaDevices &&
			typeof navigator.mediaDevices.getUserMedia === "function" &&
			typeof MediaRecorder !== "undefined"
		);
	}
}
