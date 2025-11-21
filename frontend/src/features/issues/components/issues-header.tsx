import { memo } from "react";

interface IssuesHeaderProps {
	onCreateIssue: () => void;
}

/**
 * Issues Header Component
 * Displays page title, description, and action buttons
 * Memoized to prevent unnecessary re-renders when parent state changes
 */
export const IssuesHeader = memo(function IssuesHeader({
	onCreateIssue,
}: IssuesHeaderProps) {
	return (
		<div className="mb-8 flex items-start justify-between">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Issues</h1>
				<p className="text-gray-600">
					Manage and track all customer support tickets
				</p>
			</div>
			<button
				type="button"
				onClick={onCreateIssue}
				className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-sm"
			>
				<svg
					className="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 4v16m8-8H4"
					/>
				</svg>
				New Issue
			</button>
		</div>
	);
});
