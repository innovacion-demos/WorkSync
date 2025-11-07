import { create } from 'zustand';
import type { Issue, IssueStatus, IssuePriority } from '../types';

interface IssuesState {
	issues: Issue[];
	selectedIssues: Set<string>;
	filterStatus: IssueStatus | 'all';
	searchQuery: string;
	setIssues: (issues: Issue[]) => void;
	toggleIssueSelection: (issueId: string) => void;
	selectAllIssues: () => void;
	clearSelection: () => void;
	setFilterStatus: (status: IssueStatus | 'all') => void;
	setSearchQuery: (query: string) => void;
	getFilteredIssues: () => Issue[];
}

// Mock data generator
const generateMockIssues = (): Issue[] => {
	const statuses: IssueStatus[] = ['open', 'pending', 'solved', 'closed'];
	const priorities: IssuePriority[] = ['low', 'normal', 'high', 'urgent'];
	const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown'];
	const subjects = [
		'Unable to login to account',
		'Payment processing error',
		'Feature request: Dark mode',
		'Bug: Page not loading',
		'Question about billing',
		'Integration with third-party service',
		'Performance issues on mobile',
		'Data export not working',
		'Email notifications not received',
		'Account suspension appeal',
	];
	const agents = ['Alex Chen', 'Maria Garcia', 'David Lee', null, 'Emma Wilson'];
	const tags = [['billing', 'urgent'], ['bug'], ['feature'], ['account'], ['payment'], ['integration'], ['performance'], ['export'], ['notifications']];

	return Array.from({ length: 25 }, (_, i) => ({
		id: `ISSUE-${1000 + i}`,
		subject: subjects[i % subjects.length],
		requester: names[i % names.length],
		requesterId: `user-${100 + i}`,
		status: statuses[i % statuses.length],
		priority: priorities[i % priorities.length],
		assignee: agents[i % agents.length],
		createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
		tags: tags[i % tags.length] || [],
	}));
};

export const useIssuesStore = create<IssuesState>((set, get) => ({
	issues: generateMockIssues(),
	selectedIssues: new Set(),
	filterStatus: 'all',
	searchQuery: '',

	setIssues: (issues) => set({ issues }),

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
		set(() => {
			const filteredIssues = get().getFilteredIssues();
			return { selectedIssues: new Set(filteredIssues.map((issue) => issue.id)) };
		}),

	clearSelection: () => set({ selectedIssues: new Set() }),

	setFilterStatus: (status) => set({ filterStatus: status, selectedIssues: new Set() }),

	setSearchQuery: (query) => set({ searchQuery: query, selectedIssues: new Set() }),

	getFilteredIssues: () => {
		const { issues, filterStatus, searchQuery } = get();
		return issues.filter((issue) => {
			const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
			const matchesSearch =
				searchQuery === '' ||
				issue.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
				issue.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
				issue.id.toLowerCase().includes(searchQuery.toLowerCase());
			return matchesStatus && matchesSearch;
		});
	},
}));
