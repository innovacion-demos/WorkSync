import { useIssuesStore } from "../store/useIssuesStore";
import { IssuesTable } from "./IssuesTable";

export function AdminIssuesView() {
	const {
		filterStatus,
		setFilterStatus,
		searchQuery,
		setSearchQuery,
		selectedIssues,
		getFilteredIssues,
	} = useIssuesStore();
	const filteredIssues = getFilteredIssues();

	const statusCounts = {
		all: useIssuesStore.getState().issues.length,
		open: useIssuesStore.getState().issues.filter((i) => i.status === "open")
			.length,
		pending: useIssuesStore
			.getState()
			.issues.filter((i) => i.status === "pending").length,
		solved: useIssuesStore
			.getState()
			.issues.filter((i) => i.status === "solved").length,
		closed: useIssuesStore
			.getState()
			.issues.filter((i) => i.status === "closed").length,
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-[1600px] mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Issues</h1>
					<p className="text-gray-600">
						Manage and track all customer support tickets
					</p>
				</div>

				{/* Filters and Search */}
				<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
					<div className="flex gap-2 flex-wrap">
						<button
							type="button"
							onClick={() => setFilterStatus("all")}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === "all"
									? "bg-blue-600 text-white shadow-sm"
									: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							All{" "}
							<span className="ml-1 text-xs opacity-75">
								({statusCounts.all})
							</span>
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("open")}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === "open"
									? "bg-yellow-600 text-white shadow-sm"
									: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							Open{" "}
							<span className="ml-1 text-xs opacity-75">
								({statusCounts.open})
							</span>
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("pending")}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === "pending"
									? "bg-blue-600 text-white shadow-sm"
									: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							Pending{" "}
							<span className="ml-1 text-xs opacity-75">
								({statusCounts.pending})
							</span>
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("solved")}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === "solved"
									? "bg-green-600 text-white shadow-sm"
									: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							Solved{" "}
							<span className="ml-1 text-xs opacity-75">
								({statusCounts.solved})
							</span>
						</button>
						<button
							type="button"
							onClick={() => setFilterStatus("closed")}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filterStatus === "closed"
									? "bg-gray-600 text-white shadow-sm"
									: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
							}`}
						>
							Closed{" "}
							<span className="ml-1 text-xs opacity-75">
								({statusCounts.closed})
							</span>
						</button>
					</div>

					<div className="relative w-full sm:w-80">
						<input
							type="text"
							placeholder="Search issues..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						<svg
							className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Search icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>

				{/* Selection Info */}
				{selectedIssues.size > 0 && (
					<div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
						<span className="text-sm text-blue-900 font-medium">
							{selectedIssues.size} issue{selectedIssues.size !== 1 ? "s" : ""}{" "}
							selected
						</span>
						<div className="flex gap-2">
							<button
								type="button"
								className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
							>
								Bulk Edit
							</button>
							<button
								type="button"
								className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
							>
								Assign
							</button>
							<button
								type="button"
								className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
							>
								Change Status
							</button>
						</div>
					</div>
				)}

				{/* Results Count */}
				<div className="mb-4 text-sm text-gray-600">
					Showing {filteredIssues.length} issue
					{filteredIssues.length !== 1 ? "s" : ""}
				</div>

				{/* Table */}
				<IssuesTable />
			</div>
		</div>
	);
}
