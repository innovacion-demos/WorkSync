/**
 * Backend Issue Types
 * Types matching the backend IssueResponse and related DTOs
 */

/**
 * Backend Issue Response
 * Matches IssueResponse from IssueController.java
 */
export interface BackendIssue {
	id: number;
	title: string;
	description: string;
	requester: string;
	status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
	priority: string; // LOW, NORMAL, HIGH, URGENT
	assignedUserId: number | null;
	assignedUsername: string | null;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

/**
 * Create Issue Request
 * Matches CreateIssueRequest from IssueController.java
 */
export interface CreateIssueRequest {
	title: string;
	description: string;
	requester?: string; // Optional, defaults to "Unknown"
	priority?: string; // Optional, defaults to "NORMAL" (LOW, NORMAL, HIGH, URGENT)
	tags?: string[]; // Optional, defaults to []
	assignedUserId?: number | null; // Optional, user ID to assign issue to
}

/**
 * Assign Issue Request
 */
export interface AssignIssueRequest {
	userId: number;
}

/**
 * Unassign Issue Request
 */
export interface UnassignIssueRequest {
	userId: number;
}

/**
 * Update Status Request
 */
export interface UpdateStatusRequest {
	status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
	userId: number;
}
