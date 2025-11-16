import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import {
	useIssuesStore,
	selectEmployeeStats,
} from "@/features/issues/store/use-issues-store";
import { IssuesTableSkeleton } from "@/features/issues/components/issues-table-skeleton";
import { EmployeeCard } from "@/features/issues/components/employee-card";

/**
 * By Employee View
 * View component for displaying issues grouped by employee/assignee
 * Shows statistics and issues for each employee
 */
export function ByEmployeeView() {
	const { issues, searchQuery, setSearchQuery, hasInitialized } =
		useIssuesStore(
			useShallow((state) => ({
				issues: state.issues,
				searchQuery: state.searchQuery,
				setSearchQuery: state.setSearchQuery,
				hasInitialized: state.hasInitialized,
			})),
		);

	const employeeStats = useMemo(
		() => selectEmployeeStats({ issues }),
		[issues],
	);

	const expandAll = () => {
		document.querySelectorAll("details").forEach((details) => {
			details.open = true;
		});
	};

	const collapseAll = () => {
		document.querySelectorAll("details").forEach((details) => {
			details.open = false;
		});
	};

	const filteredEmployees = employeeStats.filter((emp) => {
		if (!searchQuery) return true;

		const matchesName = emp.name
			.toLowerCase()
			.includes(searchQuery.toLowerCase());
		const matchesIssue = emp.issues.some(
			(issue) =>
				issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				issue.id.toLowerCase().includes(searchQuery.toLowerCase()),
		);

		return matchesName || matchesIssue;
	});

	// Show skeleton on initial load
	if (!hasInitialized) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-[1600px] mx-auto px-6 py-8">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Issues by Employee
						</h1>
						<p className="text-gray-600">
							View and manage issues grouped by assigned employee
						</p>
					</div>
					<IssuesTableSkeleton />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-[1600px] mx-auto px-6 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Issues by Employee
					</h1>
					<p className="text-gray-600">
						View and manage issues grouped by assigned employee
					</p>
				</div>

				<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex gap-3">
						<button
							type="button"
							onClick={expandAll}
							className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
							aria-label="Expand all employee sections"
						>
							Expand All
						</button>
						<button
							type="button"
							onClick={collapseAll}
							className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
							aria-label="Collapse all employee sections"
						>
							Collapse All
						</button>
					</div>

					<div className="relative w-full sm:w-80">
						<input
							type="text"
							placeholder="Search employees or issues..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							aria-label="Search employees or issues"
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

				<div className="space-y-6">
					{filteredEmployees.map((employee) => (
						<EmployeeCard
							key={employee.name}
							name={employee.name}
							issues={employee.issues}
						/>
					))}

					{filteredEmployees.length === 0 && (
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-12 text-center">
							<p className="text-gray-500">
								No employees found matching your search
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
