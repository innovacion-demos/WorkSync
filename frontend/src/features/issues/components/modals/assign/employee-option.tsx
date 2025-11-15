/**
 * EmployeeOption Component
 * Radio button option for assigning issues to an employee
 */

import type { BackendUser } from "@/services/users/user-types";

/**
 * Get label class names for employee options
 */
function getEmployeeLabelClasses(
	isCurrentAssignee: boolean,
	isSelected: boolean,
	useCustom: boolean
): string {
	if (isCurrentAssignee) {
		return "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed";
	}
	if (isSelected && !useCustom) {
		return "border-blue-500 bg-blue-50 cursor-pointer";
	}
	return "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer";
}

/**
 * EmployeeOption Component Props
 */
interface EmployeeOptionProps {
	readonly employee: BackendUser;
	readonly issueCount: number;
	readonly isCurrentAssignee: boolean;
	readonly isSelected: boolean;
	readonly useCustom: boolean;
	readonly onSelect: (value: string) => void;
}

/**
 * EmployeeOption Component
 */
export function EmployeeOption({
	employee,
	issueCount,
	isCurrentAssignee,
	isSelected,
	useCustom,
	onSelect,
}: EmployeeOptionProps) {
	return (
		<label
			className={`flex items-center p-3 border-2 rounded-lg transition-all ${getEmployeeLabelClasses(
				isCurrentAssignee,
				isSelected,
				useCustom
			)}`}
		>
			<span className="sr-only">Assign to {employee.name}</span>
			<input
				type="radio"
				id={`assignee-${employee.id}`}
				name="assignee"
				value={employee.username}
				checked={isSelected && !useCustom}
				disabled={isCurrentAssignee}
				onChange={(e) => onSelect(e.target.value)}
				className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<div className="ml-3 flex items-center gap-3 flex-1">
				<div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
					{employee.name.charAt(0)}
				</div>
				<div className="flex-1">
					<span className="font-medium text-gray-900">{employee.name}</span>
					<p className="text-xs text-gray-600">
						{isCurrentAssignee
							? "Already assigned to this user"
							: `${employee.username}${employee.department ? ` • ${employee.department}` : ""} • ${issueCount} issue${issueCount === 1 ? "" : "s"}`}
					</p>
				</div>
				{isCurrentAssignee && <span className="text-xs text-gray-500 italic">Current</span>}
			</div>
		</label>
	);
}
