interface VoiceOrbProps {
	isListening: boolean;
}

export function VoiceOrb({ isListening }: VoiceOrbProps) {
	return (
		<div className="relative w-48 h-48" aria-hidden="true">
			<div className="absolute inset-0 animate-pulse-slow">
				<div className="absolute inset-[-50px] rounded-full bg-blue-600/20 blur-2xl" />
				<div className="absolute inset-[-30px] rounded-full bg-blue-600/30 blur-xl" />
			</div>

			<div
				className={`
					relative w-full h-full rounded-full shadow-2xl
					transition-all duration-300 ease-out
					${isListening ? "bg-gradient-to-br from-blue-400 to-blue-600 scale-110" : "bg-gradient-to-br from-blue-600 to-blue-800 scale-100"}
				`}
			>
				{isListening && (
					<>
						<div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
						<div
							className="absolute inset-0 rounded-full bg-white/15 animate-ping"
							style={{ animationDelay: "0.2s" }}
						/>
						<div
							className="absolute inset-0 rounded-full bg-white/10 animate-ping"
							style={{ animationDelay: "0.4s" }}
						/>
					</>
				)}

				<div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/30 to-transparent animate-shimmer" />

				<div className="absolute inset-0 flex items-center justify-center">
					<svg
						className="w-20 h-20 text-white drop-shadow-lg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
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
