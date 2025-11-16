/**
 * UnassignOption Component
 * Radio button option for unassigning issues
 */

/**
 * Get label class names based on state
 */
function getUnassignLabelClasses(
	isCurrentAssignee: boolean,
	isSelected: boolean,
	useCustom: boolean,
): string {
	if (isCurrentAssignee) {
		return "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed";
	}
	if (isSelected && !useCustom) {
		return "border-red-500 bg-red-50 cursor-pointer";
	}
	return "border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer";
}

/**
 * UnassignOption Component Props
 */
interface UnassignOptionProps {
	readonly isCurrentAssignee: boolean;
	readonly isSelected: boolean;
	readonly useCustom: boolean;
	readonly onSelect: (value: string) => void;
}

/**
 * UnassignOption Component
 */
export function UnassignOption({
	isCurrentAssignee,
	isSelected,
	useCustom,
	onSelect,
}: UnassignOptionProps) {
	return (
		<label
			className={`flex items-center p-3 border-2 rounded-lg transition-all ${getUnassignLabelClasses(
				isCurrentAssignee,
				isSelected,
				useCustom,
			)}`}
		>
			<span className="sr-only">Unassign issues</span>
			<input
				type="radio"
				id="assignee-unassign"
				name="assignee"
				value="unassign"
				checked={isSelected && !useCustom}
				disabled={isCurrentAssignee}
				onChange={(e) => onSelect(e.target.value)}
				className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
			/>
			<div className="ml-3 flex items-center gap-3 flex-1">
				<div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-bold">
					−
				</div>
				<div className="flex-1">
					<span className="font-medium text-gray-900">Unassign</span>
					<p className="text-xs text-gray-600">
						{isCurrentAssignee
							? "Already unassigned"
							: "Remove current assignee"}
					</p>
				</div>
				{isCurrentAssignee && (
					<span className="text-xs text-gray-500 italic">Current</span>
				)}
			</div>
		</label>
	);
}
