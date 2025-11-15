import { useEffect, useState } from "react";
import { Dialog } from "@/components/dialog";
import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";

interface BulkEditModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly selectedCount: number;
	readonly onSubmit: (updates: {
		status?: IssueStatus;
		priority?: IssuePriority;
		assignee?: string;
	}) => void;
}

export function BulkEditModal({
	isOpen,
	onClose,
	selectedCount,
	onSubmit,
}: BulkEditModalProps) {
	const [status, setStatus] = useState<IssueStatus | "">("");
	const [priority, setPriority] = useState<IssuePriority | "">("");
	const [assignee, setAssignee] = useState("");

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setStatus("");
			setPriority("");
			setAssignee("");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const updates: {
			status?: IssueStatus;
			priority?: IssuePriority;
			assignee?: string;
		} = {};

		if (status) updates.status = status;
		if (priority) updates.priority = priority;
		if (assignee.trim()) updates.assignee = assignee.trim();

		// Only submit if at least one field is filled
		if (Object.keys(updates).length > 0) {
			onSubmit(updates);
			onClose();
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose} className="max-w-md">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold">Bulk Edit Issues</h2>
						<p className="text-sm text-blue-100 mt-1">
							Editing {selectedCount} issue{selectedCount === 1 ? "" : "s"}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-white/80 hover:text-white transition-colors"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>Close</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<p className="text-sm text-gray-600">
						Select the fields you want to update. Leave blank to keep current
						values.
					</p>

					{/* Status */}
					<div>
						<label
							htmlFor="bulk-status"
							className="block text-sm font-medium text-gray-900 mb-2"
						>
							Status
						</label>
						<select
							id="bulk-status"
							value={status}
							onChange={(e) => setStatus(e.target.value as IssueStatus | "")}
							className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
						>
							<option value="">Keep current status</option>
							<option value="open">Open</option>
							<option value="pending">Pending</option>
							<option value="solved">Solved</option>
							<option value="closed">Closed</option>
						</select>
					</div>

					{/* Priority */}
					<div>
						<label
							htmlFor="bulk-priority"
							className="block text-sm font-medium text-gray-900 mb-2"
						>
							Priority
						</label>
						<select
							id="bulk-priority"
							value={priority}
							onChange={(e) =>
								setPriority(e.target.value as IssuePriority | "")
							}
							className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
						>
							<option value="">Keep current priority</option>
							<option value="low">Low ↓</option>
							<option value="normal">Normal −</option>
							<option value="high">High ↑</option>
							<option value="urgent">Urgent !!</option>
						</select>
					</div>

					{/* Assignee */}
					<div>
						<label
							htmlFor="bulk-assignee"
							className="block text-sm font-medium text-gray-900 mb-2"
						>
							Assignee
						</label>
						<input
							id="bulk-assignee"
							type="text"
							value={assignee}
							onChange={(e) => setAssignee(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Keep current assignee"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="submit"
							disabled={!status && !priority && !assignee.trim()}
							className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							Update Issues
						</button>
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
		</Dialog>
	);
}
