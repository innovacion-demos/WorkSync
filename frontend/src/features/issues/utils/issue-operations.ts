import { issuesApi } from "@/services/issues/issues-api";
import { usersApi } from "@/services/users/users-api";
import type { IssueStatus } from "@/features/issues/types/issue";

/**
 * Update issue status via API
 */
export async function updateIssueStatus(
	issueId: string,
	numericId: number,
	status: IssueStatus
): Promise<void> {
	await issuesApi.updateStatus(numericId, status);
	console.log(`[Store] Updated status for ${issueId} to ${status}`);
}

/**
 * Unassign issue via API
 */
export async function unassignIssue(issueId: string, numericId: number): Promise<void> {
	await issuesApi.unassign(numericId);
	console.log(`[Store] Unassigned ${issueId}`);
}

/**
 * Assign issue to user via API
 * Finds user by username or name and assigns the issue
 */
export async function assignIssue(
	issueId: string,
	numericId: number,
	assigneeName: string
): Promise<void> {
	const users = await usersApi.fetchAll();
	const user = users.find(u => u.username === assigneeName || u.name === assigneeName);

	if (user) {
		await issuesApi.assign(numericId, user.id);
		console.log(`[Store] Assigned ${issueId} to user ${user.id} (${user.name})`);
	} else {
		console.error(`[Store] User not found: ${assigneeName}`);
	}
}
