import { memo } from "react";
import type { Issue, IssueStatus } from "@/features/issues/types/issue";
import { statusStyles, priorityStyles, priorityIcons } from "@/features/issues/constants/issue-styles";
import { formatRelativeDate } from "@/features/issues/utils/date-format";

interface EmployeeCardProps {
	readonly name: string;
	readonly issues: Issue[];
	readonly defaultOpen?: boolean;
}

/**
 * Employee Card Component
 * Displays employee information with expandable issue list using native <details>
 * Shows employee stats and all assigned issues
 */
export const EmployeeCard = memo(function EmployeeCard({
	name,
	issues,
	defaultOpen = true,
}: EmployeeCardProps) {
	const isUnassigned = name === "Unassigned";
	const count = issues.length;

	return (
		<details
			open={defaultOpen}
			className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group"
		>
			{/* Employee Header */}
			<summary className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
				<div className="flex items-center gap-4">
					<div
						className={`w-12 h-12 rounded-full ${
							isUnassigned
								? "bg-gradient-to-br from-gray-400 to-gray-500"
								: "bg-gradient-to-br from-blue-400 to-purple-500"
						} flex items-center justify-center text-white text-lg font-bold`}
						aria-hidden="true"
					>
						{isUnassigned ? "?" : name.charAt(0)}
					</div>

					<div className="text-left">
						<h2 className="text-xl font-bold text-gray-900">{name}</h2>
						<p className="text-sm text-gray-600">
							{count} issue{count === 1 ? "" : "s"} assigned
						</p>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="hidden sm:flex gap-2">
						{["open", "pending", "solved", "closed"].map((status) => {
							const statusCount = issues.filter((i) => i.status === status).length;
							if (statusCount === 0) return null;
							return (
								<span
									key={status}
									className={`px-3 py-1 rounded-full text-xs font-medium border ${
										statusStyles[status as IssueStatus]
									}`}
								>
									{statusCount} {status.charAt(0).toUpperCase() + status.slice(1)}
								</span>
							);
						})}
					</div>

					<svg
						className="h-6 w-6 text-gray-500 transition-transform group-open:rotate-180"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</summary>

			{/* Employee Issues Table */}
			<div className="border-t border-gray-200">
					{issues.length === 0 ? (
						<div className="px-6 py-12 text-center text-gray-500">
							No issues assigned
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-gray-50 border-b border-gray-200">
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
											Updated
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{issues.map((issue) => (
										<tr
											key={issue.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="text-sm font-medium text-blue-600">
													{issue.id}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex flex-col">
													<span className="text-sm font-medium text-gray-900">
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
													<div
														className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium mr-3"
														aria-hidden="true"
													>
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
													className={`text-sm flex items-center gap-1 ${
														priorityStyles[issue.priority]
													}`}
												>
													<span className="text-base">
														{priorityIcons[issue.priority]}
													</span>
													{issue.priority.charAt(0).toUpperCase() +
														issue.priority.slice(1)}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{formatRelativeDate(issue.updatedAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
			</div>
		</details>
	);
});
