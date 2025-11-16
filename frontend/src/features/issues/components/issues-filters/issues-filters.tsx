import { EmployeeFilter } from "@/features/issues/components/issues-filters/employee-filter";
import type { IssueStatus } from "@/features/issues/types/issue";
import { memo } from "react";

type FilterStatus = IssueStatus | "all";

interface StatusCounts {
	all: number;
	open: number;
	pending: number;
	solved: number;
	closed: number;
}

interface IssuesFiltersProps {
	filterStatus: FilterStatus;
	searchQuery: string;
	statusCounts: StatusCounts;
	onFilterStatusChange: (status: FilterStatus) => void;
	onSearchChange: (query: string) => void;
}

/**
 * Issues Filters Component
 * Handles status filtering, employee filtering, and search
 * Memoized to prevent re-renders when unrelated state changes
 */
export const IssuesFilters = memo(function IssuesFilters({
	filterStatus,
	searchQuery,
	statusCounts,
	onFilterStatusChange,
	onSearchChange,
}: IssuesFiltersProps) {
	return (
		<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
			<div className="flex gap-4 flex-wrap items-center">
				<EmployeeFilter />

				<div className="flex gap-2 flex-wrap">
					<button
						type="button"
						onClick={() => onFilterStatusChange("all")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filterStatus === "all"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						All <span className="ml-1 text-xs">({statusCounts.all})</span>
					</button>
					<button
						type="button"
						onClick={() => onFilterStatusChange("open")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filterStatus === "open"
								? "bg-yellow-600 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						Open <span className="ml-1 text-xs">({statusCounts.open})</span>
					</button>
					<button
						type="button"
						onClick={() => onFilterStatusChange("pending")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filterStatus === "pending"
								? "bg-blue-600 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						Pending{" "}
						<span className="ml-1 text-xs">({statusCounts.pending})</span>
					</button>
					<button
						type="button"
						onClick={() => onFilterStatusChange("solved")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filterStatus === "solved"
								? "bg-green-600 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						Solved <span className="ml-1 text-xs">({statusCounts.solved})</span>
					</button>
					<button
						type="button"
						onClick={() => onFilterStatusChange("closed")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filterStatus === "closed"
								? "bg-gray-600 text-white shadow-sm"
								: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
						}`}
					>
						Closed <span className="ml-1 text-xs">({statusCounts.closed})</span>
					</button>
				</div>
			</div>

			<div className="relative w-full sm:w-80">
				<input
					type="text"
					placeholder="Search issues..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					aria-label="Search issues"
				/>
				<svg
					className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>
	);
});
