import { lazy, Suspense } from "react";
import { IssuesPage } from "@/features/issues/issues-page";

const FloatingChat = lazy(() =>
	import("@/components/floating-chat").then((module) => ({
		default: module.FloatingChat,
	})),
);

/**
 * App Root Component
 * Main entry point for the application
 * Handles global layout and feature composition
 */
function App() {
	return (
		<>
			<IssuesPage />
			<Suspense fallback={null}>
				<FloatingChat />
			</Suspense>
		</>
	);
}

export default App;
