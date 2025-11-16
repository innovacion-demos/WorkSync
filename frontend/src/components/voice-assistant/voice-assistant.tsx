import { useEffect, useRef } from "react";
import { useVoiceAssistant } from "@/components/hooks/use-voice-assistant";
import { Dialog } from "@/components/dialog";
import { VoiceOrb } from "./voice-orb";
import { playTextToSpeech } from "@/services/deepgram/deepgram-tts";
import { audioCache } from "@/services/deepgram/audio-cache";

const GREETING_TEXT = "Hola Andrés, ¿qué necesitas?";

export function VoiceAssistant() {
	const { isOpen, isListening, close } = useVoiceAssistant();
	const hasPlayedGreetingRef = useRef(false);

	useEffect(() => {
		if (isOpen && !hasPlayedGreetingRef.current) {
			hasPlayedGreetingRef.current = true;
			audioCache
				.get(GREETING_TEXT)
				.then((blob) => playTextToSpeech(GREETING_TEXT, blob))
				.catch((error) => {
					console.error("TTS Error:", error);
				});
		}

		if (!isOpen) {
			hasPlayedGreetingRef.current = false;
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<Dialog
			isOpen={isOpen}
			onClose={close}
			className="bg-transparent shadow-none max-w-none max-h-none w-full h-full flex items-center justify-center"
		>
			<div className="relative flex items-center justify-center">
				<h2 className="sr-only">Asistente de voz</h2>
				<VoiceOrb isListening={isListening} />
			</div>
		</Dialog>
	);
}
