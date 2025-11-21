import { useEffect, useRef } from "react";
import { useVoiceAssistant } from "@/components/hooks/use-voice-assistant";
import { useVoiceConversation } from "@/components/hooks/use-voice-conversation";
import { VoiceOrb } from "./voice-orb";
import { playTextToSpeech } from "@/services/deepgram/deepgram-tts";
import { audioCache } from "@/services/deepgram/audio-cache";

const GREETING_TEXT = "Hola Andrés, ¿qué necesitas?";

export function VoiceAssistant() {
	const { isOpen, isListening, close } = useVoiceAssistant();
	const {
		state,
		transcript,
		partialTranscript,
		response,
		error,
		startRecording,
		stopRecording,
		reset,
	} = useVoiceConversation();

	const hasPlayedGreetingRef = useRef(false);
	const previousListeningRef = useRef(false);

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
			reset();
		}
	}, [isOpen, reset]);

	// Handle recording based on spacebar (isListening)
	useEffect(() => {
		const wasListening = previousListeningRef.current;
		previousListeningRef.current = isListening;

		// Start recording when spacebar pressed
		if (isListening && !wasListening && state === "idle") {
			startRecording();
		}

		// Stop and process when spacebar released
		if (!isListening && wasListening && state === "recording") {
			stopRecording();
		}
	}, [isListening, state, startRecording, stopRecording]);

	// Handle ESC key to close
	useEffect(() => {
		if (!isOpen) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				close();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isOpen, close]);

	// Get status message based on conversation state
	const getStatusMessage = () => {
		if (error) return `Error: ${error}`;
		if (state === "recording" && partialTranscript)
			return partialTranscript; // Show real-time transcript
		if (state === "recording") return "Escuchando...";
		if (transcript && state === "thinking") return `Pensando...`;
		if (state === "speaking") return response || "Hablando...";
		return "Mantén presionada la barra espaciadora para hablar";
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 pointer-events-none z-50 flex items-end justify-center pb-8">
			<div
				className="pointer-events-auto bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-xl border border-gray-300/50 shadow-2xl rounded-full px-8 py-4 flex items-center gap-4 max-w-md transition-all duration-300 animate-slide-up"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className="sr-only">Asistente de voz</h2>

				{/* Voice Orb */}
				<div className="flex-shrink-0">
					<VoiceOrb isListening={isListening || state !== "idle"} />
				</div>

				{/* Status Text */}
				<div className="flex-1 min-w-0">
					<p
						className={`text-sm font-semibold truncate ${
							error
								? "text-red-600"
								: state === "speaking"
									? "text-blue-700"
									: state === "recording" && partialTranscript
										? "text-green-700"
										: "text-gray-900"
						}`}
					>
						{getStatusMessage()}
					</p>

					{/* Show what user said while thinking/speaking */}
					{transcript && (state === "thinking" || state === "speaking") && (
						<p className="text-xs text-gray-700 truncate mt-1">
							"{transcript}"
						</p>
					)}
				</div>

				{/* Close button */}
				<button
					onClick={close}
					className="flex-shrink-0 text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-900/10"
					aria-label="Cerrar asistente de voz"
				>
					<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
}
