/**
 * Issue Mappers
 * Convert between backend and frontend issue formats
 */

import type { Issue, IssueStatus, IssuePriority } from "@/features/issues/types/issue";
import type { BackendIssue } from "@/services/issues/issue-types";

const BACKEND_TO_FRONTEND_STATUS: Record<string, IssueStatus> = {
	OPEN: "open",
	IN_PROGRESS: "pending",
	RESOLVED: "solved",
	CLOSED: "closed",
	REJECTED: "closed",
} as const;

const FRONTEND_TO_BACKEND_STATUS: Record<IssueStatus, string> = {
	open: "OPEN",
	pending: "IN_PROGRESS",
	solved: "RESOLVED",
	closed: "CLOSED",
} as const;

const BACKEND_TO_FRONTEND_PRIORITY: Record<string, IssuePriority> = {
	LOW: "low",
	NORMAL: "normal",
	HIGH: "high",
	URGENT: "urgent",
} as const;

const FRONTEND_TO_BACKEND_PRIORITY: Record<IssuePriority, string> = {
	low: "LOW",
	normal: "NORMAL",
	high: "HIGH",
	urgent: "URGENT",
} as const;

/**
 * Map backend status to frontend status
 */
export function mapBackendStatusToFrontend(backendStatus: string): IssueStatus {
	const mapped = BACKEND_TO_FRONTEND_STATUS[backendStatus];
	if (!mapped) {
		console.warn(`Unknown backend status: ${backendStatus}, defaulting to open`);
		return "open";
	}
	return mapped;
}

/**
 * Map frontend status to backend status
 */
export function mapFrontendStatusToBackend(frontendStatus: IssueStatus): string {
	return FRONTEND_TO_BACKEND_STATUS[frontendStatus] || "OPEN";
}

/**
 * Map backend priority to frontend priority
 */
export function mapBackendPriorityToFrontend(backendPriority: string): IssuePriority {
	const mapped = BACKEND_TO_FRONTEND_PRIORITY[backendPriority];
	if (!mapped) {
		console.warn(`Unknown backend priority: ${backendPriority}, defaulting to normal`);
		return "normal";
	}
	return mapped;
}

/**
 * Map frontend priority to backend priority
 */
export function mapFrontendPriorityToBackend(frontendPriority: IssuePriority): string {
	return FRONTEND_TO_BACKEND_PRIORITY[frontendPriority] || "NORMAL";
}

/**
 * Convert backend issue to frontend issue
 */
export function convertBackendIssue(backendIssue: BackendIssue): Issue {
	return {
		id: `ISSUE-${backendIssue.id}`,
		title: backendIssue.title,
		requester: backendIssue.requester || "Unknown",
		requesterId: "user-0",
		status: mapBackendStatusToFrontend(backendIssue.status),
		priority: mapBackendPriorityToFrontend(backendIssue.priority),
		assignee: backendIssue.assignedUsername,
		createdAt: new Date(backendIssue.createdAt),
		// Use createdAt if updatedAt is null (issue hasn't been updated yet)
		updatedAt: backendIssue.updatedAt ? new Date(backendIssue.updatedAt) : new Date(backendIssue.createdAt),
		tags: backendIssue.tags || [],
		description: backendIssue.description,
	};
}
