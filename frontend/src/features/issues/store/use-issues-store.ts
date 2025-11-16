import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { issuesApi } from "@/services/issues/issues-api";
import type { IssueEventMessage } from "@/services/websocket/websocket";
import type {
	Issue,
	IssuePriority,
	IssueStatus,
} from "@/features/issues/types/issue";
import { EMPLOYEE_FILTER } from "@/features/issues/utils/filters";
import {
	updateIssueStatus,
	assignIssue,
	unassignIssue,
} from "@/features/issues/utils/issue-operations";
import { EVENT_HANDLERS } from "@/features/issues/utils/websocket-event-handlers";
import { selectFilteredIssues } from "@/features/issues/store/selectors";
import { mapFrontendPriorityToBackend } from "@/services/issues/issue-mappers";

type FilterStatus = IssueStatus | "all";

// Re-export selectors for convenience
export * from "./selectors";

/**
 * Issues Store State Interface
 */
interface IssuesState {
	issues: Issue[];
	selectedIssues: Set<string>;
	filterStatus: FilterStatus;
	filterEmployee: string;
	searchQuery: string;
	isLoading: boolean;
	hasInitialized: boolean;

	setIssues: (issues: Issue[]) => void;
	loadIssuesFromAPI: () => Promise<void>;
	addIssue: (
		issue: Omit<Issue, "id" | "createdAt" | "updatedAt" | "requesterId"> & {
			assignedUserId?: number | null;
		},
	) => Promise<void>;
	updateIssues: (
		issueIds: string[],
		updates: {
			status?: IssueStatus;
			priority?: IssuePriority;
			assignee?: string | null;
		},
	) => Promise<void>;
	handleWebSocketEvent: (event: IssueEventMessage) => void;
	deleteIssue: (issueId: string) => void;
	toggleIssueSelection: (issueId: string) => void;
	selectAllIssues: () => void;
	clearSelection: () => void;
	setFilterStatus: (status: FilterStatus) => void;
	setFilterEmployee: (employee: string) => void;
	setSearchQuery: (query: string) => void;
}

export const useIssuesStore = create<IssuesState>()(
	devtools(
		(set, get) => ({
			issues: [],
			selectedIssues: new Set(),
			filterStatus: "all",
			filterEmployee: EMPLOYEE_FILTER.ALL,
			searchQuery: "",
			isLoading: false,
			hasInitialized: false,

			setIssues: (issues) => set({ issues }),

			loadIssuesFromAPI: async () => {
				set({ isLoading: true });

				try {
					const issues = await issuesApi.fetchAll();
					set({ issues, isLoading: false, hasInitialized: true });
				} catch (error) {
					console.error("[Store] Failed to load issues from API:", error);
					set({ isLoading: false, hasInitialized: true });
				}
			},

			addIssue: async (issue) => {
				try {
					const createRequest = {
						title: issue.title,
						description: issue.description || "",
						requester: issue.requester,
						priority: mapFrontendPriorityToBackend(issue.priority),
						tags: issue.tags,
						assignedUserId: issue.assignedUserId || null,
					};

					await issuesApi.create(createRequest);
					// Don't add to state here - let the WebSocket event handle it
				} catch (error) {
					console.error("[Store] Failed to create issue:", error);
				}
			},

			updateIssues: async (issueIds, updates) => {
				const originalIssues = get().issues;

				set((state) => ({
					issues: state.issues.map((issue) =>
						issueIds.includes(issue.id)
							? {
									...issue,
									...(updates.status && { status: updates.status }),
									...(updates.assignee !== undefined && {
										assignee: updates.assignee,
									}),
									...(updates.priority && { priority: updates.priority }),
									updatedAt: new Date(),
								}
							: issue,
					),
					selectedIssues: new Set(),
				}));

				try {
					await Promise.all(
						issueIds.map(async (issueId) => {
							const numericId = Number.parseInt(
								issueId.replace("ISSUE-", ""),
								10,
							);

							if (updates.status) {
								await updateIssueStatus(issueId, numericId, updates.status);
							}

							if (updates.assignee !== undefined) {
								if (updates.assignee === null) {
									await unassignIssue(issueId, numericId);
								} else {
									await assignIssue(issueId, numericId, updates.assignee);
								}
							}
						}),
					);
				} catch (error) {
					console.error("[Store] Failed to update issues:", error);
					set({ issues: originalIssues });
				}
			},

			toggleIssueSelection: (issueId) =>
				set((state) => {
					const newSelected = new Set(state.selectedIssues);
					if (newSelected.has(issueId)) {
						newSelected.delete(issueId);
					} else {
						newSelected.add(issueId);
					}
					return { selectedIssues: newSelected };
				}),

			selectAllIssues: () =>
				set((state) => {
					const filteredIssues = selectFilteredIssues(state);
					return {
						selectedIssues: new Set(filteredIssues.map((issue) => issue.id)),
					};
				}),

			clearSelection: () => set({ selectedIssues: new Set() }),

			setFilterStatus: (status) =>
				set({ filterStatus: status, selectedIssues: new Set() }),

			setFilterEmployee: (employee) =>
				set({ filterEmployee: employee, selectedIssues: new Set() }),

			setSearchQuery: (query) =>
				set({ searchQuery: query, selectedIssues: new Set() }),

			handleWebSocketEvent: (event: IssueEventMessage) => {
				const issueId = `ISSUE-${event.issueId}`;
				const handler = EVENT_HANDLERS[event.eventType];

				if (handler) {
					handler(event, issueId, set);
				}
			},

			deleteIssue: (issueId) =>
				set((state) => ({
					issues: state.issues.filter((issue) => issue.id !== issueId),
					selectedIssues: new Set(
						Array.from(state.selectedIssues).filter((id) => id !== issueId),
					),
				})),
		}),
		{
			name: "IssuesStore",
			enabled: import.meta.env.DEV,
		},
	),
);
