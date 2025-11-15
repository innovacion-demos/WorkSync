/**
 * WebSocket Event Mappers
 * Convert WebSocket events to frontend domain models
 */

import type { Issue } from "@/features/issues/types/issue";
import { mapBackendStatusToFrontend, mapBackendPriorityToFrontend } from "@/services/issues/issue-mappers";
import type { IssueEventMessage } from "@/services/websocket/websocket";

/**
 * Convert WebSocket IssueEventMessage to frontend Issue
 */
export function convertEventMessageToIssue(event: IssueEventMessage): Issue {
	const timestamp = event.timestamp ? new Date(event.timestamp) : new Date();
	return {
		id: `ISSUE-${event.issueId}`,
		title: event.title,
		requester: event.requester || "Unknown",
		requesterId: `user-${event.triggeredByUserId ?? 0}`,
		status: mapBackendStatusToFrontend(event.status),
		priority: mapBackendPriorityToFrontend(event.priority),
		assignee: event.assignedUsername,
		createdAt: timestamp,
		updatedAt: timestamp,
		tags: event.tags || [],
		description: event.description,
	};
}
