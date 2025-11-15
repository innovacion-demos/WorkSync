export type IssueStatus = "open" | "pending" | "solved" | "closed";
export type IssuePriority = "low" | "normal" | "high" | "urgent";

export interface Issue {
	id: string;
	title: string;
	requester: string;
	requesterId: string;
	status: IssueStatus;
	priority: IssuePriority;
	assignee: string | null;
	createdAt: Date;
	updatedAt: Date;
	tags: string[];
	description?: string;
}
