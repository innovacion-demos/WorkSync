import { issuesApi } from "@/services/issues/issues-api";
import { usersApi } from "@/services/users/users-api";
import type { IssueStatus } from "@/features/issues/types/issue";

export async function updateIssueStatus(
	_issueId: string,
	numericId: number,
	status: IssueStatus,
): Promise<void> {
	await issuesApi.updateStatus(numericId, status);
}

export async function unassignIssue(
	_issueId: string,
	numericId: number,
): Promise<void> {
	await issuesApi.unassign(numericId);
}

export async function assignIssue(
	_issueId: string,
	numericId: number,
	assigneeName: string,
): Promise<void> {
	const users = await usersApi.fetchAll();
	const user = users.find(
		(u) => u.username === assigneeName || u.name === assigneeName,
	);

	if (user) {
		await issuesApi.assign(numericId, user.id);
	} else {
		console.error(`[Store] User not found: ${assigneeName}`);
	}
}
