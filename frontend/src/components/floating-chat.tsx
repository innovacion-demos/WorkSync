import { useEffect, useRef, useState } from "react";

interface Message {
	id: string;
	text: string;
	sender: "user" | "agent";
	timestamp: Date;
}

export function FloatingChat() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: "Hello Andres! I'm your Issues Assistant. I can help you:\n\n• View issues by employee\n• Check issue status\n• Get statistics\n• Find specific issues\n\nHow can I assist you?",
			sender: "agent",
			timestamp: new Date(),
		},
	]);
	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen && messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [isOpen]);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputText.trim(),
			sender: "user",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputText("");
		setIsTyping(true);

		try {
			// TODO: Integrate with real AI (OpenAI, Claude, etc)
			await new Promise((resolve) => setTimeout(resolve, 800));
			const mockReply =
				"I'm a placeholder response. Connect me to a real AI API (OpenAI, Claude, etc.) to provide intelligent answers about your issues.";

			const agentResponse: Message = {
				id: (Date.now() + 1).toString(),
				text: mockReply,
				sender: "agent",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, agentResponse]);
		} catch (error) {
			console.error("Error sending message:", error);

			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				text: "Sorry, I'm having trouble processing your message. Please try again.",
				sender: "agent",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsTyping(false);
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleVoiceRecording = () => {
		// TODO: Implement voice recording
		setIsRecording(!isRecording);
	};

	return (
		<>
			{isOpen && (
				<div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
					<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="relative">
								<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
									<svg
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
										/>
									</svg>
								</div>
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
							</div>
							<div>
								<h3 className="font-semibold">Issues Assistant</h3>
								<p className="text-xs text-blue-100">
									AI-powered bot • Always available
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-white/80 hover:text-white transition-colors"
							aria-label="Close chat"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
										message.sender === "user"
											? "bg-blue-600 text-white rounded-br-sm"
											: "bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-200"
									}`}
								>
									<p className="text-sm whitespace-pre-wrap break-words">
										{message.text}
									</p>
									<p
										className={`text-xs mt-1 ${
											message.sender === "user"
												? "text-blue-100"
												: "text-gray-500"
										}`}
									>
										{formatTime(message.timestamp)}
									</p>
								</div>
							</div>
						))}

						{isTyping && (
							<div className="flex justify-start">
								<div className="bg-white text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-200">
									<div className="flex gap-1">
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
										<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
									</div>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>

					<form
						onSubmit={handleSendMessage}
						className="p-4 bg-white border-t border-gray-200 rounded-b-2xl"
					>
						<div className="flex gap-2 items-end">
							<button
								type="button"
								onClick={handleVoiceRecording}
								className={`p-2.5 rounded-xl transition-all ${
									isRecording
										? "bg-red-500 text-white hover:bg-red-600 animate-pulse"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
								title={isRecording ? "Stop recording" : "Start voice recording"}
								aria-label={
									isRecording ? "Stop recording" : "Start voice recording"
								}
							>
								{isRecording ? (
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<rect x="6" y="6" width="12" height="12" rx="2" />
									</svg>
								) : (
									<svg
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
										/>
									</svg>
								)}
							</button>

							<div className="flex-1 relative">
								<input
									ref={inputRef}
									type="text"
									value={inputText}
									onChange={(e) => setInputText(e.target.value)}
									placeholder={
										isRecording ? "Recording..." : "Type a message..."
									}
									disabled={isRecording}
									className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
									aria-label="Chat message input"
								/>
								{isRecording && (
									<div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
										<div className="w-1 h-3 bg-red-500 rounded-full animate-pulse" />
										<div className="w-1 h-4 bg-red-500 rounded-full animate-pulse delay-100" />
										<div className="w-1 h-3 bg-red-500 rounded-full animate-pulse delay-200" />
									</div>
								)}
							</div>

							<button
								type="submit"
								disabled={!inputText.trim() || isRecording}
								className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
								title="Send message"
								aria-label="Send message"
							>
								<svg
									className="h-5 w-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
								</svg>
							</button>
						</div>

						{isRecording && (
							<div className="mt-2 flex items-center gap-2 text-red-500 text-xs">
								<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
								<span className="font-medium">Recording audio...</span>
							</div>
						)}
					</form>
				</div>
			)}

			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 flex items-center justify-center z-50 ${
					isOpen ? "rotate-0 scale-95" : "hover:scale-110"
				}`}
				aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
			>
				{isOpen ? (
					<svg
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				) : (
					<>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
						<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
							1
						</span>
					</>
				)}
			</button>
		</>
	);
}
