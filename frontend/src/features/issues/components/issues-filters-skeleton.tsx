import { memo } from "react";

/**
 * Issues Filters Skeleton Component
 * Loading state placeholder that mimics the structure of IssuesFilters
 * Provides visual feedback during initial data load
 * Memoized since it's static
 */
export const IssuesFiltersSkeleton = memo(function IssuesFiltersSkeleton() {
	return (
		<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
			<div className="flex gap-4 flex-wrap items-center">
				{/* Employee filter skeleton */}
				<div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse" />

				{/* Status filter buttons skeleton */}
				<div className="flex gap-2 flex-wrap">
					{[1, 2, 3, 4, 5].map((id) => (
						<div
							key={`filter-skeleton-${id}`}
							className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>

			{/* Search input skeleton */}
			<div className="w-full sm:w-80">
				<div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse" />
			</div>
		</div>
	);
});
