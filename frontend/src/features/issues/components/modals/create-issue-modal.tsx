import { useState, useEffect } from "react";
import { Dialog } from "@/components/dialog";
import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";
import { usersApi } from "@/services/users/users-api";
import type { BackendUser } from "@/services/users/user-types";

interface CreateIssueModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (issueData: {
		title: string;
		requester: string;
		status: IssueStatus;
		priority: IssuePriority;
		assignedUserId: number | null;
		description: string;
		tags: string[];
	}) => void;
}

export function CreateIssueModal({
	isOpen,
	onClose,
	onSubmit,
}: CreateIssueModalProps) {
	const [title, setTitle] = useState("");
	const [requester, setRequester] = useState("");
	const [status, setStatus] = useState<IssueStatus>("open");
	const [priority, setPriority] = useState<IssuePriority>("normal");
	const [assignedUserId, setAssignedUserId] = useState<number | null>(null);
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [users, setUsers] = useState<BackendUser[]>([]);
	const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setTitle("");
			setRequester("");
			setStatus("open");
			setPriority("normal");
			setAssignedUserId(null);
			setDescription("");
			setTags([]);
			setTagInput("");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({
			title,
			requester,
			status,
			priority,
			assignedUserId,
			description,
			tags,
		});
		onClose();
	};

	const handleAddTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags([...tags, tagInput.trim()]);
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTag();
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose}>
			{/* Header */}
			<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
					<h2 className="text-xl font-bold text-gray-900">Create New Issue</h2>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<title>Close</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{/* Title */}
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
							Title <span className="text-red-500">*</span>
						</label>
						<input
							id="title"
							type="text"
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Brief description of the issue"
						/>
					</div>

					{/* Requester */}
					<div>
						<label htmlFor="requester" className="block text-sm font-medium text-gray-900 mb-2">
							Requester <span className="text-red-500">*</span>
						</label>
						<input
							id="requester"
							type="text"
							required
							value={requester}
							onChange={(e) => setRequester(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Name of the person requesting"
						/>
					</div>

					{/* Status and Priority Row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* Status */}
						<div>
							<label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
								Status
							</label>
							<select
								id="status"
								value={status}
								onChange={(e) => setStatus(e.target.value as IssueStatus)}
								className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
							>
								<option value="open">Open</option>
								<option value="pending">Pending</option>
								<option value="solved">Solved</option>
								<option value="closed">Closed</option>
							</select>
						</div>

						{/* Priority */}
						<div>
							<label htmlFor="priority" className="block text-sm font-medium text-gray-900 mb-2">
								Priority
							</label>
							<select
								id="priority"
								value={priority}
								onChange={(e) => setPriority(e.target.value as IssuePriority)}
								className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
							>
								<option value="low">Low ↓</option>
								<option value="normal">Normal −</option>
								<option value="high">High ↑</option>
								<option value="urgent">Urgent !!</option>
							</select>
						</div>
					</div>

					{/* Assignee */}
					<div>
						<label htmlFor="assignee" className="block text-sm font-medium text-gray-900 mb-2">
							Assignee
						</label>
						<select
							id="assignee"
							value={assignedUserId || ""}
							onChange={(e) => setAssignedUserId(e.target.value ? Number(e.target.value) : null)}
							disabled={isLoadingUsers}
							className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
						>
							<option value="">Unassigned</option>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name} ({user.username})
								</option>
							))}
						</select>
						{isLoadingUsers && (
							<p className="mt-1 text-xs text-gray-500">Loading users...</p>
						)}
					</div>

					{/* Tags */}
					<div>
						<label htmlFor="tags" className="block text-sm font-medium text-gray-900 mb-2">
							Tags
						</label>
						<div className="flex gap-2 mb-2">
							<input
								id="tags"
								type="text"
								value={tagInput}
								onChange={(e) => setTagInput(e.target.value)}
								onKeyDown={handleTagKeyDown}
								className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Add a tag and press Enter"
							/>
							<button
								type="button"
								onClick={handleAddTag}
								className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
							>
								Add
							</button>
						</div>
						{tags.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
									>
										{tag}
										<button
											type="button"
											onClick={() => handleRemoveTag(tag)}
											className="hover:text-red-600 transition-colors"
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					{/* Description */}
					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
							Description <span className="text-red-500">*</span>
						</label>
						<textarea
							id="description"
							required
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={4}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
							placeholder="Detailed description of the issue"
						/>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<button
							type="submit"
							className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
						>
							Create Issue
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
