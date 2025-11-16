import { memo } from "react";

interface IssuesHeaderProps {
	onCreateIssue: () => void;
	onCreateFromText: () => void;
}

/**
 * Issues Header Component
 * Displays page title, description, and action buttons
 * Memoized to prevent unnecessary re-renders when parent state changes
 */
export const IssuesHeader = memo(function IssuesHeader({
	onCreateIssue,
	onCreateFromText,
}: IssuesHeaderProps) {
	return (
		<div className="mb-8 flex items-start justify-between">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Issues</h1>
				<p className="text-gray-600">
					Manage and track all customer support tickets
				</p>
			</div>
			<div className="flex gap-3">
				<button
					type="button"
					onClick={onCreateFromText}
					className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium shadow-sm"
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
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					From Text
				</button>
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
		</div>
	);
});
