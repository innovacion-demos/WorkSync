import { useState } from "react";
import { AllIssuesView } from "@/features/issues/views/all-issues-view";
import { ByEmployeeView } from "@/features/issues/views/by-employee-view";
import { useIssuesSync } from "@/features/issues/hooks/use-issues-sync";

type ViewType = "all-issues" | "by-employee";

/**
 * Issues Page
 * Main page for the Issues feature
 * Handles view switching between All Issues and By Employee views
 */
export function IssuesPage() {
	const [currentView, setCurrentView] = useState<ViewType>("all-issues");

	useIssuesSync();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
				<div className="max-w-[1600px] mx-auto px-6 py-3">
					<div className="flex items-center justify-between gap-6">
						<div className="flex items-center gap-2.5">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
								<svg
									className="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
									/>
								</svg>
							</div>
							<h1 className="text-lg font-bold text-gray-900">
								Issues
							</h1>
						</div>

						<nav className="relative flex bg-gray-100 rounded-lg p-1">
							{/* Sliding indicator */}
							<div
								className="absolute top-1 bottom-1 bg-blue-600 rounded-md shadow-sm transition-all duration-300 ease-out"
								style={{
									left: currentView === "all-issues" ? "0.25rem" : "calc(50% + 0.125rem)",
									width: "calc(50% - 0.375rem)",
								}}
							/>

							<button
								type="button"
								onClick={() => setCurrentView("all-issues")}
								className={`relative z-10 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
									currentView === "all-issues"
										? "text-white"
										: "text-gray-700 hover:text-gray-900"
								}`}
							>
								<div className="flex items-center justify-center gap-1.5">
									<svg
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
										/>
									</svg>
									All Issues
								</div>
							</button>
							<button
								type="button"
								onClick={() => setCurrentView("by-employee")}
								className={`relative z-10 flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
									currentView === "by-employee"
										? "text-white"
										: "text-gray-700 hover:text-gray-900"
								}`}
							>
								<div className="flex items-center justify-center gap-1.5">
									<svg
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
									By Employee
								</div>
							</button>
						</nav>
					</div>
				</div>
			</div>

			<div>
				{currentView === "all-issues" ? (
					<AllIssuesView />
				) : (
					<ByEmployeeView />
				)}
			</div>
		</div>
	);
}
