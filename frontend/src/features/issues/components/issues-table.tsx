import { useShallow } from "zustand/react/shallow";
import { useIssuesStore, selectFilteredIssues } from "@/features/issues/store/use-issues-store";
import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";

const statusStyles: Record<IssueStatus, string> = {
	open: "bg-yellow-100 text-yellow-800 border-yellow-200",
	pending: "bg-blue-100 text-blue-800 border-blue-200",
	solved: "bg-green-100 text-green-800 border-green-200",
	closed: "bg-gray-100 text-gray-800 border-gray-200",
};

const priorityStyles: Record<IssuePriority, string> = {
	low: "text-gray-600",
	normal: "text-blue-600",
	high: "text-orange-600",
	urgent: "text-red-600 font-semibold",
};

const priorityIcons: Record<IssuePriority, string> = {
	low: "↓",
	normal: "−",
	high: "↑",
	urgent: "!!",
};

export function IssuesTable() {
	const filteredIssues = useIssuesStore(useShallow(selectFilteredIssues));
	const selectedIssues = useIssuesStore((state) => state.selectedIssues);

	const { toggleIssueSelection, selectAllIssues, clearSelection } = useIssuesStore(
		useShallow((state) => ({
			toggleIssueSelection: state.toggleIssueSelection,
			selectAllIssues: state.selectAllIssues,
			clearSelection: state.clearSelection,
		}))
	);

	const allSelected =
		filteredIssues.length > 0 &&
		filteredIssues.every((issue) => selectedIssues.has(issue.id));
	const someSelected =
		filteredIssues.some((issue) => selectedIssues.has(issue.id)) &&
		!allSelected;

	const handleSelectAll = () => {
		if (allSelected) {
			clearSelection();
		} else {
			selectAllIssues();
		}
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));

		if (days === 0) return "Today";
		if (days === 1) return "Yesterday";
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-200">
							<th className="w-12 px-4 py-3 text-left">
								<input
									type="checkbox"
									id="select-all-issues"
									name="select-all-issues"
									checked={allSelected}
									ref={(input) => {
										if (input) input.indeterminate = someSelected;
									}}
									onChange={handleSelectAll}
									className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
									aria-label="Select all issues"
								/>
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Subject
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Requester
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Priority
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Assignee
							</th>
							<th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
								Updated
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{filteredIssues.length === 0 ? (
							<tr>
								<td
									colSpan={8}
									className="px-6 py-12 text-center text-gray-500"
								>
									No issues found
								</td>
							</tr>
						) : (
							filteredIssues.map((issue) => (
								<tr
									key={issue.id}
									className={`hover:bg-gray-50 transition-colors ${
										selectedIssues.has(issue.id) ? "bg-blue-50" : ""
									}`}
								>
									<td className="px-4 py-4">
										<input
											type="checkbox"
											id={`select-${issue.id}`}
											name={`select-${issue.id}`}
											checked={selectedIssues.has(issue.id)}
											onChange={() => toggleIssueSelection(issue.id)}
											className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
											aria-label={`Select issue ${issue.id}: ${issue.title}`}
										/>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
											{issue.id}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-col">
											<span className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
												{issue.title}
											</span>
											{issue.tags.length > 0 && (
												<div className="flex gap-1 mt-1">
													{issue.tags.map((tag, index) => (
														<span
															key={`${issue.id}-${tag}-${index}`}
															className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
														>
															{tag}
														</span>
													))}
												</div>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium mr-3">
												{issue.requester.charAt(0)}
											</div>
											<span className="text-sm text-gray-900">
												{issue.requester}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
												statusStyles[issue.status]
											}`}
										>
											{issue.status.charAt(0).toUpperCase() +
												issue.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`text-sm flex items-center gap-1 ${priorityStyles[issue.priority]}`}
										>
											<span className="text-base">
												{priorityIcons[issue.priority]}
											</span>
											{issue.priority.charAt(0).toUpperCase() +
												issue.priority.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{issue.assignee ? (
											<div className="flex items-center">
												<div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-medium mr-2">
													{issue.assignee.charAt(0)}
												</div>
												<span className="text-sm text-gray-900">
													{issue.assignee}
												</span>
											</div>
										) : (
											<span className="text-sm text-gray-600 italic">
												Unassigned
											</span>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{formatDate(issue.updatedAt)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
