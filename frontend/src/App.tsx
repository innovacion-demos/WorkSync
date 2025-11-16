import { lazy, Suspense, useEffect } from "react";
import { IssuesPage } from "@/features/issues/issues-page";
import { VoiceAssistant } from "@/components/voice-assistant/voice-assistant";
import { audioCache } from "@/services/deepgram/audio-cache";

const FloatingChat = lazy(() =>
	import("@/components/floating-chat").then((module) => ({
		default: module.FloatingChat,
	})),
);

function App() {
	useEffect(() => {
		audioCache.preload("Hola Andrés, ¿qué necesitas?");
	}, []);

	return (
		<>
			<IssuesPage />
			<Suspense fallback={null}>
				<FloatingChat />
			</Suspense>
			<VoiceAssistant />
		</>
	);
}

export default App;
