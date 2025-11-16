const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || "";
const DEEPGRAM_TTS_URL = "https://api.deepgram.com/v1/speak";

interface DeepgramTTSOptions {
	text: string;
	model?: string;
}

export async function textToSpeech({
	text,
	model = "aura-2-nestor-es",
}: DeepgramTTSOptions): Promise<Blob> {
	if (!DEEPGRAM_API_KEY) {
		throw new Error("VITE_DEEPGRAM_API_KEY is not configured");
	}

	const response = await fetch(`${DEEPGRAM_TTS_URL}?model=${model}`, {
		method: "POST",
		headers: {
			Authorization: `Token ${DEEPGRAM_API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Deepgram TTS failed (${response.status}): ${errorText}`,
		);
	}

	return response.blob();
}

export async function playTextToSpeech(
	text: string,
	audioBlob?: Blob,
): Promise<void> {
	const blob = audioBlob || (await textToSpeech({ text }));
	const audioUrl = URL.createObjectURL(blob);
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
