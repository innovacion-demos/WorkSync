import { useState, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { Dialog } from "@/components/dialog";
import { useIssuesStore, selectIssuesByIds } from "@/features/issues/store/use-issues-store";
import { usersApi } from "@/services/users/users-api";
import type { BackendUser } from "@/services/users/user-types";
import { UnassignOption } from "@/features/issues/components/modals/assign/unassign-option";
import { EmployeeOption } from "@/features/issues/components/modals/assign/employee-option";

interface AssignModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly selectedCount: number;
	readonly onSubmit: (assignee: string | null) => void;
}

/**
 * Get label class names for custom assignee
 */
function getCustomLabelClasses(useCustom: boolean): string {
	if (useCustom) {
		return "border-blue-500 bg-blue-50";
	}
	return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
}

export function AssignModal({
	isOpen,
	onClose,
	selectedCount,
	onSubmit,
}: AssignModalProps) {
	const [selectedAssignee, setSelectedAssignee] = useState<string>("");
	const [customAssignee, setCustomAssignee] = useState("");
	const [useCustom, setUseCustom] = useState(false);
	const [users, setUsers] = useState<BackendUser[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

	// Group state selections
	const { selectedIssues, issues } = useIssuesStore(
		useShallow((state) => ({
			selectedIssues: state.selectedIssues,
			issues: state.issues,
		}))
	);

	// Fetch users when modal opens
	useEffect(() => {
		if (isOpen) {
			const fetchUsers = async () => {
				setIsLoadingUsers(true);
				const fetchedUsers = await usersApi.fetchAll();
				setUsers(fetchedUsers);
				setIsLoadingUsers(false);
			};
			fetchUsers();
		}
	}, [isOpen]);

	// Calculate issue counts per user
	const userIssueCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const issue of issues) {
			if (issue.assignee) {
				counts[issue.assignee] = (counts[issue.assignee] || 0) + 1;
			}
		}
		return counts;
	}, [issues]);

	const selectedIssuesList = useMemo(() =>
		selectIssuesByIds({ issues }, Array.from(selectedIssues)),
		[issues, selectedIssues]
	);

	const currentAssignees = new Set(
		selectedIssuesList.map(issue => issue.assignee || "unassign")
	);

	const allHaveSameAssignee = currentAssignees.size === 1;
	const currentCommonAssignee = allHaveSameAssignee
		? Array.from(currentAssignees)[0]
		: null;

	useEffect(() => {
		if (!isOpen) {
			setSelectedAssignee("");
			setCustomAssignee("");
			setUseCustom(false);
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (useCustom && customAssignee.trim()) {
			onSubmit(customAssignee.trim());
		} else if (selectedAssignee === "unassign") {
			onSubmit(null);
		} else if (selectedAssignee) {
			onSubmit(selectedAssignee);
		}

		onClose();
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose} className="max-w-lg">
			{/* Header */}
			<div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold">Assign Issues</h2>
						<p className="text-sm text-blue-100 mt-1">
							Assigning {selectedCount} issue{selectedCount === 1 ? "" : "s"}
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
				<form onSubmit={handleSubmit} className="p-6">
					{/* Info message when all have same assignee */}
					{allHaveSameAssignee && currentCommonAssignee && (
						<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="flex items-start gap-2">
								<svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<title>Info</title>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div className="flex-1">
									<p className="text-sm font-medium text-blue-900">
										{currentCommonAssignee === "unassign"
											? "All selected issues are unassigned"
											: `All selected issues are assigned to ${currentCommonAssignee}`}
									</p>
									<p className="text-xs text-blue-700 mt-1">
										The current option is disabled. Select a different assignee to update.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Existing Employees */}
					<div className="mb-6">
						<h3 className="text-sm font-semibold text-gray-900 mb-3">
							Assign to employee
						</h3>
						{isLoadingUsers ? (
							<div className="text-center py-8 text-gray-500">
								<p className="text-sm">Loading users...</p>
							</div>
						) : (
							<div className="space-y-2 max-h-64 overflow-y-auto">
								<UnassignOption
									isCurrentAssignee={currentCommonAssignee === "unassign"}
									isSelected={selectedAssignee === "unassign"}
									useCustom={useCustom}
									onSelect={(value) => {
										setSelectedAssignee(value);
										setUseCustom(false);
									}}
								/>

								{users.map((user) => (
									<EmployeeOption
										key={user.id}
										employee={user}
										issueCount={userIssueCounts[user.username] || 0}
										isCurrentAssignee={currentCommonAssignee === user.username}
										isSelected={selectedAssignee === user.username}
										useCustom={useCustom}
										onSelect={(value) => {
											setSelectedAssignee(value);
											setUseCustom(false);
										}}
									/>
								))}
							</div>
						)}
					</div>

					{/* Divider */}
					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">or</span>
						</div>
					</div>

					{/* Custom Assignee */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3">
							Assign to new employee
						</h3>
						<label
							className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${getCustomLabelClasses(useCustom)}`}
						>
							<span className="sr-only">Assign to new employee</span>
							<input
								type="radio"
								id="assignee-custom"
								name="assignee"
								checked={useCustom}
								onChange={() => {
									setUseCustom(true);
									setSelectedAssignee("");
								}}
								className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
							/>
							<div className="ml-3 flex-1">
								<input
									type="text"
									value={customAssignee}
									onChange={(e) => {
										setCustomAssignee(e.target.value);
										setUseCustom(true);
										setSelectedAssignee("");
									}}
									onFocus={() => {
										setUseCustom(true);
										setSelectedAssignee("");
									}}
									placeholder="Enter employee name"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</label>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-6">
						<button
							type="submit"
							disabled={
								!selectedAssignee && (!useCustom || !customAssignee.trim())
							}
							className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							Assign Issues
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
