import { createSelector } from "reselect";
import type { Issue, IssueStatus } from "@/features/issues/types/issue";
import {
	matchesEmployee,
	matchesSearch,
	matchesStatus,
} from "@/features/issues/utils/filters";

type FilterStatus = IssueStatus | "all";

interface IssuesStoreState {
	issues: Issue[];
	filterStatus: FilterStatus;
	filterEmployee: string;
	searchQuery: string;
}

const selectIssues = (state: IssuesStoreState) => state.issues;
const selectFilterStatus = (state: IssuesStoreState) => state.filterStatus;
const selectFilterEmployee = (state: IssuesStoreState) => state.filterEmployee;
const selectSearchQuery = (state: IssuesStoreState) => state.searchQuery;

export const selectFilteredIssues = createSelector(
	[selectIssues, selectFilterStatus, selectFilterEmployee, selectSearchQuery],
	(issues, filterStatus, filterEmployee, searchQuery) =>
		issues.filter(
			(issue) =>
				matchesStatus(issue, filterStatus) &&
				matchesEmployee(issue, filterEmployee) &&
				matchesSearch(issue, searchQuery),
		),
);

export const selectEmployeeStats = (
	state: Pick<IssuesStoreState, "issues">,
) => {
	const grouped = state.issues.reduce(
		(acc, issue) => {
			const name = issue.assignee || "Unassigned";
			acc[name] = acc[name] || [];
			acc[name].push(issue);
			return acc;
		},
		{} as Record<string, Issue[]>,
	);

	return Object.entries(grouped)
		.map(([name, employeeIssues]) => ({
			name,
			count: employeeIssues.length,
			issues: employeeIssues,
		}))
		.sort((a, b) => b.count - a.count);
};

export const selectIssueById = (
	state: IssuesStoreState,
	issueId: string,
): Issue | undefined => state.issues.find((issue) => issue.id === issueId);

export const selectSelectedCount = (state: {
	selectedIssues: Set<string>;
}): number => state.selectedIssues.size;

export const selectHasSelection = (state: {
	selectedIssues: Set<string>;
}): boolean => state.selectedIssues.size > 0;

export const selectStatusCounts = (state: Pick<IssuesStoreState, "issues">) => {
	const counts = {
		all: state.issues.length,
		open: 0,
		pending: 0,
		solved: 0,
		closed: 0,
	};

	for (const issue of state.issues) {
		counts[issue.status]++;
	}

	return counts;
};

export const selectTotalIssuesCount = (
	state: Pick<IssuesStoreState, "issues">,
): number => state.issues.length;

export const selectIssuesByIds = (
	state: Pick<IssuesStoreState, "issues">,
	issueIds: string[],
) => state.issues.filter((issue) => issueIds.includes(issue.id));
