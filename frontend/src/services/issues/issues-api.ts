/**
 * Issues API
 * REST API operations for issues
 */

import type { Issue, IssueStatus } from "@/features/issues/types/issue";
import { API_CONFIG, ENDPOINTS } from "@/services/config";
import { convertBackendIssue, mapFrontendStatusToBackend } from "@/services/issues/issue-mappers";
import type {
	AssignIssueRequest,
	BackendIssue,
	CreateIssueRequest,
	UnassignIssueRequest,
	UpdateStatusRequest,
} from "./issue-types";

/**
 * Issues API Service
 */
export const issuesApi = {
	/**
	 * Fetch all issues from backend
	 */
	async fetchAll(): Promise<Issue[]> {
		try {
			const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ISSUES.BASE}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: BackendIssue[] = await response.json();
			console.log(`[IssuesAPI] Fetched ${data.length} issues from backend`);
			return data.map(convertBackendIssue);
		} catch (error) {
			console.error("[IssuesAPI] Failed to fetch issues:", error);
			// Return empty array, WebSocket will handle updates
			return [];
		}
	},

	/**
	 * Create a new issue
	 */
	async create(issueData: CreateIssueRequest): Promise<Issue | null> {
		try {
			const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ISSUES.BASE}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(issueData),
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: BackendIssue = await response.json();
			console.log("[IssuesAPI] Created issue:", data.id);
			return convertBackendIssue(data);
		} catch (error) {
			console.error("[IssuesAPI] Failed to create issue:", error);
			return null;
		}
	},

	/**
	 * Assign an issue to a user
	 */
	async assign(issueId: number, userId: number): Promise<Issue | null> {
		try {
			const body: AssignIssueRequest = { userId };
			const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ISSUES.ASSIGN(issueId)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: BackendIssue = await response.json();
			return convertBackendIssue(data);
		} catch (error) {
			console.error(`[IssuesAPI] Failed to assign issue ${issueId}:`, error);
			return null;
		}
	},

	/**
	 * Update issue status
	 */
	async updateStatus(issueId: number, status: string, userId = 0): Promise<Issue | null> {
		try {
			const body: UpdateStatusRequest = {
				status: mapFrontendStatusToBackend(status as IssueStatus),
				userId,
			};
			const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ISSUES.STATUS(issueId)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: BackendIssue = await response.json();
			return convertBackendIssue(data);
		} catch (error) {
			console.error(`[IssuesAPI] Failed to update status for issue ${issueId}:`, error);
			return null;
		}
	},

	/**
	 * Unassign an issue (remove assignee)
	 */
	async unassign(issueId: number, userId = 0): Promise<Issue | null> {
		try {
			const body: UnassignIssueRequest = { userId };
			const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.ISSUES.UNASSIGN(issueId)}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const data: BackendIssue = await response.json();
			return convertBackendIssue(data);
		} catch (error) {
			console.error(`[IssuesAPI] Failed to unassign issue ${issueId}:`, error);
			return null;
		}
	},
};
