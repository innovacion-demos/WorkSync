import { useState, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	useIssuesStore,
	selectFilteredIssues,
	selectStatusCounts,
} from "@/features/issues/store/use-issues-store";
import { IssuesHeader } from "@/features/issues/components/issues-header";
import { IssuesFilters } from "@/features/issues/components/issues-filters/issues-filters";
import { IssuesFiltersSkeleton } from "@/features/issues/components/issues-filters-skeleton";
import { IssuesSelectionToolbar } from "@/features/issues/components/issues-selection-toolbar";
import { IssuesEmptyState } from "@/features/issues/components/issues-empty-state";
import { IssuesTable } from "@/features/issues/components/issues-table";
import { IssuesTableSkeleton } from "@/features/issues/components/issues-table-skeleton";
import {
	IssuesModals,
	type ModalType,
} from "@/features/issues/components/modals/issues-modals";

/**
 * All Issues View
 * View component for displaying all issues in the system
 * Uses composition pattern for state management (declarative)
 * Smaller, focused components prevent unnecessary re-renders
 * Follows Screaming Architecture principles
 */
export function AllIssuesView() {
	const [activeModal, setActiveModal] = useState<ModalType>(null);

	const { filterStatus, searchQuery, selectedIssues, issues, hasInitialized } =
		useIssuesStore(
			useShallow((state) => ({
				filterStatus: state.filterStatus,
				searchQuery: state.searchQuery,
				selectedIssues: state.selectedIssues,
				issues: state.issues,
				hasInitialized: state.hasInitialized,
			})),
		);

	const filteredIssues = useIssuesStore(useShallow(selectFilteredIssues));

	const { setFilterStatus, setSearchQuery } = useIssuesStore(
		useShallow((state) => ({
			setFilterStatus: state.setFilterStatus,
			setSearchQuery: state.setSearchQuery,
		})),
	);

	const statusCounts = useMemo(() => selectStatusCounts({ issues }), [issues]);

	// Show skeleton on initial load
	if (!hasInitialized) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-[1600px] mx-auto px-6 py-8">
					<IssuesHeader
						onCreateIssue={() => setActiveModal("create")}
					/>

					<IssuesFiltersSkeleton />

					<div className="mt-6">
						<IssuesTableSkeleton />
					</div>
					<IssuesModals
						activeModal={activeModal}
						onCloseModal={() => setActiveModal(null)}
						selectedIssues={selectedIssues}
						selectedIssuesCount={selectedIssues.size}
					/>
				</div>
			</div>
		);
	}

	// Show empty state after data has loaded and there are no issues
	if (issues.length === 0 && hasInitialized) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-[1600px] mx-auto px-6 py-8">
					<IssuesHeader
						onCreateIssue={() => setActiveModal("create")}
					/>
					<IssuesEmptyState onCreateIssue={() => setActiveModal("create")} />
					<IssuesModals
						activeModal={activeModal}
						onCloseModal={() => setActiveModal(null)}
						selectedIssuesCount={selectedIssues.size}
						selectedIssues={selectedIssues}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-[1600px] mx-auto px-6 py-8">
				<IssuesHeader
					onCreateIssue={() => setActiveModal("create")}
				/>

				<IssuesFilters
					filterStatus={filterStatus}
					searchQuery={searchQuery}
					statusCounts={statusCounts}
					onFilterStatusChange={setFilterStatus}
					onSearchChange={setSearchQuery}
				/>

				<IssuesSelectionToolbar
					selectedCount={selectedIssues.size}
					onBulkEdit={() => setActiveModal("bulkEdit")}
					onAssign={() => setActiveModal("assign")}
					onChangeStatus={() => setActiveModal("changeStatus")}
				/>

				<div className="mb-4 text-sm text-gray-600">
					Showing {filteredIssues.length} issue
					{filteredIssues.length === 1 ? "" : "s"}
				</div>

				<IssuesTable />

				<IssuesModals
					activeModal={activeModal}
					onCloseModal={() => setActiveModal(null)}
					selectedIssuesCount={selectedIssues.size}
					selectedIssues={selectedIssues}
				/>
			</div>
		</div>
	);
}
