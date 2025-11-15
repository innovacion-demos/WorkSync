import { memo, lazy, Suspense } from "react";
import { useIssuesStore } from "@/features/issues/store/use-issues-store";
import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";

// Lazy load modals - they're only loaded when needed
const CreateIssueModal = lazy(() =>
	import("@/features/issues/components/modals/create-issue-modal").then((module) => ({
		default: module.CreateIssueModal,
	}))
);
const CreateIssueFromTextModal = lazy(() =>
	import("@/features/issues/components/modals/create-issue-from-text-modal").then((module) => ({
		default: module.CreateIssueFromTextModal,
	}))
);
const BulkEditModal = lazy(() =>
	import("@/features/issues/components/modals/bulk-edit-modal").then((module) => ({
		default: module.BulkEditModal,
	}))
);
const ChangeStatusModal = lazy(() =>
	import("@/features/issues/components/modals/change-status-modal").then((module) => ({
		default: module.ChangeStatusModal,
	}))
);
const AssignModal = lazy(() =>
	import("@/features/issues/components/modals/assign-modal").then((module) => ({
		default: module.AssignModal,
	}))
);

export type ModalType = "create" | "createFromText" | "bulkEdit" | "changeStatus" | "assign" | null;

/**
 * Parse a line for a specific field
 */
function parseField(line: string, fieldName: string): string {
	const lower = line.toLowerCase();
	if (lower.startsWith(`${fieldName}:`)) {
		return line.substring(fieldName.length + 1).trim();
	}
	return "";
}

/**
 * Parse priority from text
 */
function parsePriority(priorityText: string): IssuePriority {
	const normalized = priorityText.toLowerCase();
	if (["low", "normal", "high", "urgent"].includes(normalized)) {
		return normalized as IssuePriority;
	}
	return "normal";
}

/**
 * Parse status from text
 */
function parseStatus(statusText: string): IssueStatus {
	const normalized = statusText.toLowerCase();
	if (["open", "pending", "solved", "closed"].includes(normalized)) {
		return normalized as IssueStatus;
	}
	return "open";
}

/**
 * Parse issue data from text input
 */
function parseIssueFromText(text: string) {
	const lines = text.split("\n");
	let title = "";
	let requester = "";
	let priority: IssuePriority = "normal";
	let status: IssueStatus = "open";
	let assignee = "";
	let description = "";

	for (const line of lines) {
		const titleValue = parseField(line, "title") || parseField(line, "subject");
		const requesterValue = parseField(line, "requester");
		const priorityValue = parseField(line, "priority");
		const statusValue = parseField(line, "status");
		const assigneeValue = parseField(line, "assignee");
		const descriptionValue = parseField(line, "description");

		if (titleValue) title = titleValue;
		else if (requesterValue) requester = requesterValue;
		else if (priorityValue) priority = parsePriority(priorityValue);
		else if (statusValue) status = parseStatus(statusValue);
		else if (assigneeValue) assignee = assigneeValue;
		else if (descriptionValue) description = descriptionValue;
		else if (description) description += "\n" + line;
	}

	// Fallback values
	if (!title) title = text.split("\n")[0].substring(0, 100);
	if (!requester) requester = "Unknown";
	if (!description) description = text;

	return { title, requester, status, priority, assignee, description };
}

interface IssuesModalsProps {
	activeModal: ModalType;
	onCloseModal: () => void;
	selectedIssuesCount: number;
	selectedIssues: Set<string>;
}

export const IssuesModals = memo(function IssuesModals({
	activeModal,
	onCloseModal,
	selectedIssuesCount,
	selectedIssues,
}: IssuesModalsProps) {
	const addIssue = useIssuesStore((state) => state.addIssue);
	const updateIssues = useIssuesStore((state) => state.updateIssues);

	const handleCreateIssue = (issueData: {
		title: string;
		requester: string;
		status: "open" | "pending" | "solved" | "closed";
		priority: "low" | "normal" | "high" | "urgent";
		assignedUserId: number | null;
		description: string;
		tags: string[];
	}) => {
		addIssue({
			...issueData,
			assignee: null, // This will be handled by backend via assignedUserId
		});
		onCloseModal();
	};

	const handleCreateIssueFromText = (text: string) => {
		const parsed = parseIssueFromText(text);
		addIssue({
			...parsed,
			assignee: parsed.assignee || null,
			tags: [],
		});
		onCloseModal();
	};

	const handleBulkEdit = (updates: {
		status?: IssueStatus;
		priority?: IssuePriority;
		assignee?: string;
	}) => {
		const issueIds = Array.from(selectedIssues);
		updateIssues(issueIds, {
			...updates,
			...(updates.assignee && { assignee: updates.assignee }),
		});
		onCloseModal();
	};

	const handleChangeStatus = (status: IssueStatus) => {
		const issueIds = Array.from(selectedIssues);
		updateIssues(issueIds, { status });
		onCloseModal();
	};

	const handleAssign = (assignee: string | null) => {
		const issueIds = Array.from(selectedIssues);
		updateIssues(issueIds, { assignee });
		onCloseModal();
	};

	return (
		<Suspense fallback={null}>
			<CreateIssueModal
				isOpen={activeModal === "create"}
				onClose={onCloseModal}
				onSubmit={handleCreateIssue}
			/>
			<CreateIssueFromTextModal
				isOpen={activeModal === "createFromText"}
				onClose={onCloseModal}
				onSubmit={handleCreateIssueFromText}
			/>
			<BulkEditModal
				isOpen={activeModal === "bulkEdit"}
				onClose={onCloseModal}
				selectedCount={selectedIssuesCount}
				onSubmit={handleBulkEdit}
			/>
			<ChangeStatusModal
				isOpen={activeModal === "changeStatus"}
				onClose={onCloseModal}
				selectedCount={selectedIssuesCount}
				onSubmit={handleChangeStatus}
			/>
			<AssignModal
				isOpen={activeModal === "assign"}
				onClose={onCloseModal}
				selectedCount={selectedIssuesCount}
				onSubmit={handleAssign}
			/>
		</Suspense>
	);
});
