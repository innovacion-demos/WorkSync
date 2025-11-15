import type { Issue, IssueStatus } from "@/features/issues/types/issue";

type FilterStatus = IssueStatus | "all";

/**
 * Employee filter constants
 */
export const EMPLOYEE_FILTER = {
	ALL: "all",
	UNASSIGNED: "unassigned",
} as const;

/**
 * Check if issue matches the status filter
 */
export function matchesStatus(issue: Issue, filterStatus: FilterStatus): boolean {
	return filterStatus === "all" || issue.status === filterStatus;
}

/**
 * Check if issue matches the employee filter
 * - EMPLOYEE_FILTER.ALL: matches all issues
 * - EMPLOYEE_FILTER.UNASSIGNED: matches only unassigned issues
 * - Otherwise: matches issues assigned to specific employee
 */
export function matchesEmployee(issue: Issue, filterEmployee: string): boolean {
	if (filterEmployee === EMPLOYEE_FILTER.ALL) return true;
	if (filterEmployee === EMPLOYEE_FILTER.UNASSIGNED) return issue.assignee === null;
	return issue.assignee === filterEmployee;
}

/**
 * Check if issue matches the search query
 * Searches in: title, requester, and issue ID
 */
export function matchesSearch(issue: Issue, searchQuery: string): boolean {
	if (searchQuery === "") return true;

	const query = searchQuery.toLowerCase();
	const searchableFields = [
		issue.title,
		issue.requester,
		issue.id,
	].map(field => field.toLowerCase());

	return searchableFields.some(field => field.includes(query));
}
