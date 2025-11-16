import { useState, useEffect } from "react";
import { Dialog } from "@/components/dialog";

interface CreateIssueFromTextModalProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (text: string) => void;
}

export function CreateIssueFromTextModal({
	isOpen,
	onClose,
	onSubmit,
}: CreateIssueFromTextModalProps) {
	const [text, setText] = useState("");

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setText("");
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (text.trim()) {
			onSubmit(text.trim());
			onClose();
		}
	};

	return (
		<Dialog isOpen={isOpen} onClose={onClose} className="max-w-3xl">
			{/* Header */}
			<div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
				<div>
					<h2 className="text-xl font-bold text-gray-900">
						Create Issue from Text
					</h2>
					<p className="text-sm text-gray-500 mt-1">
						Paste or type the issue details and we'll parse it automatically
					</p>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="text-gray-500 hover:text-gray-700 transition-colors"
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
				<div className="mb-4">
					<label
						htmlFor="issue-text"
						className="block text-sm font-medium text-gray-900 mb-2"
					>
						Issue Details <span className="text-red-500">*</span>
					</label>
					<textarea
						id="issue-text"
						required
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={12}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
						placeholder="Example:&#10;Title: Login page not loading&#10;Requester: John Doe&#10;Priority: High&#10;Status: Open&#10;&#10;Description:&#10;The login page shows a blank screen when accessed from mobile devices. This issue started after the latest update..."
					/>
					<p className="mt-2 text-xs text-gray-500">
						💡 Tip: Include title, requester, priority, status, assignee, and
						description for best results
					</p>
				</div>

				{/* Character count */}
				<div className="mb-4 text-right text-sm text-gray-500">
					{text.length} characters
				</div>

				{/* Actions */}
				<div className="flex gap-3">
					<button
						type="submit"
						disabled={!text.trim()}
						className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
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
