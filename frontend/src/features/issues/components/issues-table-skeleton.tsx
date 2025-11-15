import { memo } from "react";

/**
 * Issues Table Skeleton Component
 * Loading state placeholder that mimics the structure of IssuesTable
 * Provides visual feedback during initial data load
 * Memoized since it's static
 */
export const IssuesTableSkeleton = memo(function IssuesTableSkeleton() {
	return (
		<div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
							</th>
							<th className="px-6 py-3 text-left">
								<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
							<tr key={`skeleton-row-${id}`} className="hover:bg-gray-50">
								<td className="px-6 py-4">
									<div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
								</td>
								<td className="px-6 py-4">
									<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
								</td>
								<td className="px-6 py-4">
									<div className="space-y-2">
										<div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
										<div className="h-3 w-64 bg-gray-200 rounded animate-pulse" />
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
								</td>
								<td className="px-6 py-4">
									<div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
										<div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
									</div>
								</td>
								<td className="px-6 py-4">
									<div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
});
