import type { IssuePriority, IssueStatus } from "@/features/issues/types/issue";

/**
 * Status Badge Styles
 * Tailwind classes for status badges across the application
 */
export const statusStyles: Record<IssueStatus, string> = {
	open: "bg-yellow-100 text-yellow-800 border-yellow-200",
	pending: "bg-blue-100 text-blue-800 border-blue-200",
	solved: "bg-green-100 text-green-800 border-green-200",
	closed: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Priority Text Styles
 * Tailwind classes for priority indicators
 */
export const priorityStyles: Record<IssuePriority, string> = {
	low: "text-gray-600",
	normal: "text-blue-600",
	high: "text-orange-600",
	urgent: "text-red-600 font-semibold",
};

/**
 * Priority Icons
 * Visual indicators for priority levels
 */
export const priorityIcons: Record<IssuePriority, string> = {
	low: "↓",
	normal: "−",
	high: "↑",
	urgent: "!!",
};
