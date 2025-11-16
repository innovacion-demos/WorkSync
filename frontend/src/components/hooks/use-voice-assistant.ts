import { useEffect, useRef, useState } from "react";

export function useVoiceAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [isListening, setIsListening] = useState(false);

	const activationCountRef = useRef(0);
	const lastActivationTimeRef = useRef(0);
	const resetTimeoutRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowUp" && !isOpen) {
				const now = Date.now();
				const timeSinceLastPress = now - lastActivationTimeRef.current;

				if (timeSinceLastPress > 1000) {
					activationCountRef.current = 0;
				}

				activationCountRef.current += 1;
				lastActivationTimeRef.current = now;

				if (resetTimeoutRef.current) {
					clearTimeout(resetTimeoutRef.current);
				}

				if (activationCountRef.current === 3) {
					e.preventDefault();
					setIsOpen(true);
					activationCountRef.current = 0;
				} else {
					resetTimeoutRef.current = setTimeout(() => {
						activationCountRef.current = 0;
					}, 1000);
				}
			}

			if (isOpen && e.key === " " && !e.repeat) {
				e.preventDefault();
				setIsListening(true);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			if (isOpen && e.key === " ") {
				e.preventDefault();
				setIsListening(false);
			}
		};

		globalThis.addEventListener("keydown", handleKeyDown);
		globalThis.addEventListener("keyup", handleKeyUp);

		return () => {
			globalThis.removeEventListener("keydown", handleKeyDown);
			globalThis.removeEventListener("keyup", handleKeyUp);
			if (resetTimeoutRef.current) {
				clearTimeout(resetTimeoutRef.current);
			}
		};
	}, [isOpen]);

	const close = () => {
		setIsOpen(false);
		setIsListening(false);
	};

	return { isOpen, isListening, close };
}
