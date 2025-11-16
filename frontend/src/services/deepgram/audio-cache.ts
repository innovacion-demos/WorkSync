import { textToSpeech } from "./deepgram-tts";

class AudioCache {
	private cache: Map<string, Blob> = new Map();
	private loading: Map<string, Promise<Blob>> = new Map();

	async preload(text: string, model = "aura-2-nestor-es"): Promise<void> {
		const key = `${text}:${model}`;

		if (this.cache.has(key) || this.loading.has(key)) {
			return;
		}

		const loadingPromise = textToSpeech({ text, model });
		this.loading.set(key, loadingPromise);

		try {
			const blob = await loadingPromise;
			this.cache.set(key, blob);
		} catch (error) {
			console.error("Failed to preload audio:", error);
		} finally {
			this.loading.delete(key);
		}
	}

	async get(text: string, model = "aura-2-nestor-es"): Promise<Blob> {
		const key = `${text}:${model}`;

		if (this.cache.has(key)) {
			return this.cache.get(key)!;
		}

		if (this.loading.has(key)) {
			return this.loading.get(key)!;
		}

		return textToSpeech({ text, model });
	}

	clear(): void {
		this.cache.clear();
		this.loading.clear();
	}
}

export const audioCache = new AudioCache();
