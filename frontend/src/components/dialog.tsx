import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
	readonly isOpen: boolean;
	readonly onClose: () => void;
	readonly children: ReactNode;
	readonly className?: string;
}

export function Dialog({
	isOpen,
	onClose,
	children,
	className = "",
}: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const rootElement = document.getElementById("root");

		if (isOpen) {
			dialog.showModal();

			if (rootElement) {
				rootElement.inert = true;
			}
		} else {
			dialog.close();

			if (rootElement) {
				rootElement.inert = false;
			}
		}

		return () => {
			if (rootElement) {
				rootElement.inert = false;
			}
		};
	}, [isOpen]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const rect = dialog.getBoundingClientRect();
		const isInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;

		if (!isInDialog) {
			onClose();
		}
	};

	// Handle native dialog cancel event (ESC key)
	const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
		e.preventDefault();
		onClose();
	};

	return (
		<dialog
			ref={dialogRef}
			onClick={handleBackdropClick}
			onCancel={handleCancel}
			className={`m-auto rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm ${className}`}
		>
			{children}
		</dialog>
	);
}
