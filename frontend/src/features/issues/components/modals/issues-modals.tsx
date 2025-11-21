import { memo, lazy, Suspense } from "react";
import { useIssuesStore } from "@/features/issues/store/use-issues-store";
import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";

// Lazy load modals - they're only loaded when needed
const CreateIssueModal = lazy(() =>
	import("@/features/issues/components/modals/create-issue-modal").then(
		(module) => ({
			default: module.CreateIssueModal,
		}),
	),
);
const BulkEditModal = lazy(() =>
	import("@/features/issues/components/modals/bulk-edit-modal").then(
		(module) => ({
			default: module.BulkEditModal,
		}),
	),
);
const ChangeStatusModal = lazy(() =>
	import("@/features/issues/components/modals/change-status-modal").then(
		(module) => ({
			default: module.ChangeStatusModal,
		}),
	),
);
const AssignModal = lazy(() =>
	import("@/features/issues/components/modals/assign-modal").then((module) => ({
		default: module.AssignModal,
	})),
);

export type ModalType =
	| "create"
	| "bulkEdit"
	| "changeStatus"
	| "assign"
	| null;

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
