interface VoiceOrbProps {
	isListening: boolean;
}

export function VoiceOrb({ isListening }: VoiceOrbProps) {
	return (
		<div className="relative w-14 h-14" aria-hidden="true">
			{isListening && (
				<div className="absolute inset-0">
					<div className="absolute inset-[-12px] rounded-full bg-blue-500/30 blur-lg animate-pulse" />
					<div className="absolute inset-[-8px] rounded-full bg-blue-400/40 blur-md animate-pulse" style={{ animationDelay: "0.15s" }} />
				</div>
			)}

			<div
				className={`
					relative w-full h-full rounded-full shadow-lg
					transition-all duration-300 ease-out
					${isListening ? "bg-gradient-to-br from-blue-400 to-blue-600 scale-105" : "bg-gradient-to-br from-blue-500 to-blue-700 scale-100"}
				`}
			>
				{isListening && (
					<>
						<div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
						<div
							className="absolute inset-0 rounded-full bg-white/20 animate-ping"
							style={{ animationDelay: "0.3s" }}
						/>
					</>
				)}

				<div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

				<div className="absolute inset-0 flex items-center justify-center">
					<svg
						className="w-6 h-6 text-white drop-shadow-md"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
