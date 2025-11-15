import { memo, useState, useEffect } from "react";

interface IssuesSelectionToolbarProps {
	selectedCount: number;
	onBulkEdit: () => void;
	onAssign: () => void;
	onChangeStatus: () => void;
}

/**
 * Issues Selection Toolbar Component
 * Shows bulk actions when issues are selected
 * Only renders when there are selected issues
 * Memoized to prevent re-renders
 * Includes enter and exit animations
 */
export const IssuesSelectionToolbar = memo(function IssuesSelectionToolbar({
	selectedCount,
	onBulkEdit,
	onAssign,
	onChangeStatus,
}: IssuesSelectionToolbarProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		if (selectedCount > 0) {
			setIsVisible(true);
			setIsExiting(false);
		} else if (isVisible) {
			setIsExiting(true);
			const timer = setTimeout(() => {
				setIsVisible(false);
				setIsExiting(false);
			}, 200); // Match animation duration
			return () => clearTimeout(timer);
		}
	}, [selectedCount, isVisible]);

	if (!isVisible) return null;

	return (
		<div className={`mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between ${isExiting ? "animate-slideOutUp" : "animate-slideInDown"}`}>
			<span className="text-sm text-blue-900 font-medium">
				{selectedCount} issue{selectedCount === 1 ? "" : "s"} selected
			</span>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={onBulkEdit}
					className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
				>
					Bulk Edit
				</button>
				<button
					type="button"
					onClick={onAssign}
					className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
				>
					Assign
				</button>
				<button
					type="button"
					onClick={onChangeStatus}
					className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
				>
					Change Status
				</button>
			</div>
		</div>
	);
});
