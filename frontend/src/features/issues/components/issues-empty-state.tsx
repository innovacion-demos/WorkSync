import { memo } from "react";

interface IssuesEmptyStateProps {
	onCreateIssue: () => void;
}

/**
 * Issues Empty State Component
 * Displayed when there are no issues in the system
 * Encourages user to create the first issue
 * Memoized since it's static
 */
export const IssuesEmptyState = memo(function IssuesEmptyState({
	onCreateIssue,
}: IssuesEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-20">
			<svg className="h-24 w-24 text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<title>No issues icon</title>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
			</svg>
			<h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
			<p className="text-gray-600 mb-6 text-center max-w-md">
				Get started by creating your first issue using the button above.
			</p>
			<button
				type="button"
				onClick={onCreateIssue}
				className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
			>
				<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<title>Create issue</title>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
				</svg>
				Create Your First Issue
			</button>
		</div>
	);
});
