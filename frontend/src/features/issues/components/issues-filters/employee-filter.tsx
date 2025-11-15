import { useShallow } from "zustand/react/shallow";
import {
	useIssuesStore,
	selectEmployeeStats,
} from "@/features/issues/store/use-issues-store";
import { EMPLOYEE_FILTER } from "@/features/issues/utils/filters";
import { useEffect, useMemo, useRef, useState } from "react";

export function EmployeeFilter() {
	const { issues, filterEmployee, setFilterEmployee } = useIssuesStore(
		useShallow((state) => ({
			issues: state.issues,
			filterEmployee: state.filterEmployee,
			setFilterEmployee: state.setFilterEmployee,
		}))
	);

	const employeeStats = useMemo(
		() => selectEmployeeStats({ issues }),
		[issues],
	);

	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const allEmployees = [
		{ name: "All Employees", key: EMPLOYEE_FILTER.ALL, count: null },
		...employeeStats.map((e) => ({
			name: e.name,
			key: e.name === "Unassigned" ? EMPLOYEE_FILTER.UNASSIGNED : e.name,
			count: e.count,
		})),
	];

	const selectedEmployee = allEmployees.find((e) => e.key === filterEmployee);
	const availableEmployees = allEmployees.filter((e) => e.key !== filterEmployee);

	return (
		<div ref={dropdownRef} className="relative">
			<div className="relative">
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 hover:outline-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-employee-primary sm:text-sm min-w-[220px] transition-all"
				>
					<span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
						<svg
							className="h-5 w-5 text-gray-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						<span className="block truncate">
							{selectedEmployee?.name}
							{selectedEmployee?.count !== null &&
								` (${selectedEmployee?.count})`}
						</span>
					</span>
					<svg
						className="col-start-1 row-start-1 h-5 w-5 self-center justify-self-end text-gray-500 sm:h-4 sm:w-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 9l4-4 4 4m0 6l-4 4-4-4"
						/>
					</svg>
				</button>

				{isOpen && (
					<div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline outline-1 outline-black/5 sm:text-sm">
						{availableEmployees.map((employee) => (
							<button
								type="button"
								key={employee.key}
								onClick={() => {
									setFilterEmployee(employee.key);
									setIsOpen(false);
								}}
								className="group relative w-full cursor-pointer py-2 pl-3 pr-3 text-left select-none transition-colors text-gray-900 hover:bg-gray-100"
							>
								<div className="flex items-center justify-between gap-2">
									<span className="block truncate font-normal">
										{employee.name}
									</span>
									{employee.count !== null && (
										<span className="text-sm flex-shrink-0 text-gray-500">
											{employee.count}
										</span>
									)}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
