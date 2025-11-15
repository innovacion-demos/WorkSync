import { useEffect } from "react";
import { eventBus } from "@/services/websocket/event-bus";
import { useIssuesStore } from "@/features/issues/store/use-issues-store";

/**
 * Hook to sync issues with WebSocket events
 * Separates WebSocket connection logic from state management
 *
 * Uses getState() to avoid unstable dependencies - the effect runs only once
 * on mount and always uses the latest version of store functions.
 */
export function useIssuesSync() {
	useEffect(() => {
		console.log("[IssuesSync] Initializing...");

		useIssuesStore.getState().loadIssuesFromAPI();

		const unsubscribe = eventBus.subscribeToIssues((event) => {
			useIssuesStore.getState().handleWebSocketEvent(event);
		});

		eventBus.connect();

		return () => {
			console.log("[IssuesSync] Cleaning up...");
			unsubscribe();
			eventBus.disconnect();
		};
	}, []);
}
