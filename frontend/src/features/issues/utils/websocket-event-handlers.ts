import type { Issue } from "@/features/issues/types/issue";
import { convertEventMessageToIssue } from "@/services/websocket/websocket-mappers";
import type { IssueEventMessage } from "@/services/websocket/websocket";

/**
 * State setter type for issue store
 */
type StateSetter = (fn: (state: { issues: Issue[]; selectedIssues: Set<string> }) => {
	issues?: Issue[];
	selectedIssues?: Set<string>;
}) => void;

/**
 * WebSocket event handler function type
 */
export type EventHandler = (
	event: IssueEventMessage,
	issueId: string,
	set: StateSetter
) => void;

/**
 * Handle issue creation event from WebSocket
 * Deduplicates: only adds if issue doesn't already exist
 */
export const handleCreateEvent: EventHandler = (event, issueId, set) => {
	const newIssue = convertEventMessageToIssue(event);
	set((state) => {
		// Check if issue already exists (avoid duplicates from optimistic updates)
		const exists = state.issues.some((issue) => issue.id === issueId);
		if (exists) {
			console.log(`[Store] Issue ${issueId} already exists, skipping duplicate from WebSocket`);
			return {}; // No state change
		}
		return {
			issues: [newIssue, ...state.issues],
		};
	});
	console.log(`[Store] Issue ${issueId} created via WebSocket`);
};

/**
 * Handle issue update event from WebSocket
 * Preserves priority, requester, and tags from existing issue
 */
export const handleUpdateEvent: EventHandler = (event, issueId, set) => {
	set((state) => ({
		issues: state.issues.map((issue) => {
			if (issue.id === issueId) {
				const updatedIssue = convertEventMessageToIssue(event);
				return {
					...issue,
					...updatedIssue,
					priority: issue.priority,
					requester: issue.requester,
					tags: issue.tags,
				};
			}
			return issue;
		}),
	}));
	console.log(`[Store] Issue ${issueId} updated via WebSocket (${event.eventType})`);
};

/**
 * Handle issue deletion event from WebSocket
 * Removes issue from both issues list and selected issues
 */
export const handleDeleteEvent: EventHandler = (_event, issueId, set) => {
	set((state) => ({
		issues: state.issues.filter((issue) => issue.id !== issueId),
		selectedIssues: new Set(
			Array.from(state.selectedIssues).filter((id) => id !== issueId)
		),
	}));
	console.log(`[Store] Issue ${issueId} deleted via WebSocket`);
};

/**
 * Event type to handler mapping (Lookup table pattern)
 */
export const EVENT_HANDLERS: Record<string, EventHandler> = {
	CREATED: handleCreateEvent,
	UPDATED: handleUpdateEvent,
	ASSIGNED: handleUpdateEvent,
	RESOLVED: handleUpdateEvent,
	CLOSED: handleUpdateEvent,
	REJECTED: handleUpdateEvent,
	DELETED: handleDeleteEvent,
};
