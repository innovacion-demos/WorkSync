import { useState, useEffect } from "react";
import { Dialog } from "@/components/dialog";
import type { IssueStatus } from "@/features/issues/types/issue";

interface ChangeStatusModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly selectedCount: number;
	readonly onSubmit: (status: IssueStatus) => void;
}

export function ChangeStatusModal({
	isOpen,
	onClose,
	selectedCount,
	onSubmit,
}: ChangeStatusModalProps) {
	const [status, setStatus] = useState<IssueStatus>("open");

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setStatus("open");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(status);
		onClose();
	};

	const statusOptions = [
		{
			value: "open" as const,
			label: "Open",
			color: "bg-yellow-100 text-yellow-800 border-yellow-200",
			description: "Issue is acknowledged and waiting to be worked on",
		},
		{
			value: "pending" as const,
			label: "Pending",
			color: "bg-blue-100 text-blue-800 border-blue-200",
			description: "Issue is being actively worked on",
		},
		{
			value: "solved" as const,
			label: "Solved",
			color: "bg-green-100 text-green-800 border-green-200",
			description: "Issue has been resolved",
		},
		{
			value: "closed" as const,
			label: "Closed",
			color: "bg-gray-100 text-gray-800 border-gray-200",
			description: "Issue is completed and archived",
		},
	];

	return (
		<Dialog isOpen={isOpen} onClose={onClose} className="max-w-lg">
			{/* Header */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold">Change Status</h2>
						<p className="text-sm text-blue-100 mt-1">
							Updating {selectedCount} issue{selectedCount === 1 ? "" : "s"}
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
					<div className="space-y-3 mb-6">
						{statusOptions.map((option) => (
							<label
								key={option.value}
								className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
									status === option.value
										? "border-blue-500 bg-blue-50"
										: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
								}`}
							>
								<span className="sr-only">Change status to {option.label}</span>
								<input
									type="radio"
									name="status"
									value={option.value}
									checked={status === option.value}
									onChange={(e) => setStatus(e.target.value as IssueStatus)}
									className="mt-1 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
								/>
								<div className="ml-3 flex-1">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-medium text-gray-900">
											{option.label}
										</span>
										<span
											className={`text-xs px-2 py-0.5 rounded-full border ${option.color}`}
										>
											{option.label}
										</span>
									</div>
									<p className="text-sm text-gray-600">{option.description}</p>
								</div>
							</label>
						))}
					</div>

					{/* Actions */}
					<div className="flex gap-3">
						<button
							type="submit"
							className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
						>
							Update Status
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
