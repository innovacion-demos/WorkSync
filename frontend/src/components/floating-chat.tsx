import { useEffect, useRef, useState } from "react";
import {
	generateSessionId,
	sendChatMessage,
} from "../services/chatbot/chatbot-api";

interface Message {
	id: string;
	text: string;
	sender: "user" | "agent";
	timestamp: Date;
}

export function FloatingChat() {
	const [isOpen, setIsOpen] = useState(false);
	// Generate a new session ID on every mount (volatile - no persistence)
	const [sessionId] = useState(() => generateSessionId());

	// Initialize with welcome message (volatile - resets on page refresh)
	const [messages, setMessages] = useState<Message[]>([
		{
			id: "1",
			text: "Hello! I'm your AI Assistant powered by Google Gemini. I can help you with:\n\n• Answering questions\n• Providing information\n• Having natural conversations\n• And much more!\n\nHow can I assist you today?",
			sender: "agent",
			timestamp: new Date(),
		},
	]);

	const [inputText, setInputText] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, isTyping]);

	// Focus input when opening chat
	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim() || isTyping) return;

		const messageText = inputText.trim();
		const userMessage: Message = {
			id: `user-${Date.now()}`,
			text: messageText,
			sender: "user",
			timestamp: new Date(),
		};

		// Add user message and clear input immediately for better UX
		setMessages((prev) => [...prev, userMessage]);
		setInputText("");
		setIsTyping(true);

		try {
			// Call the real chatbot API
			const aiResponse = await sendChatMessage(sessionId, messageText);

			const agentResponse: Message = {
				id: `agent-${Date.now()}`,
				text: aiResponse,
				sender: "agent",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, agentResponse]);
		} catch (error) {
			console.error("[FloatingChat] Error sending message:", error);

			let errorText =
				"Sorry, I'm having trouble connecting to the AI service. Please try again in a moment.";

			if (error instanceof Error) {
				// Provide more specific error messages
				if (error.message.includes("timeout")) {
					errorText =
						"The AI is taking too long to respond. Please try a shorter message or try again later.";
				} else if (error.message.includes("Failed to fetch")) {
					errorText =
						"Unable to connect to the chatbot service. Please make sure the backend is running on http://localhost:8000";
				}
			}

			const errorMessage: Message = {
				id: `error-${Date.now()}`,
				text: errorText,
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

	const handleClearChat = () => {
		if (
			window.confirm(
				"Are you sure you want to clear the chat history? This cannot be undone.",
			)
		) {
			const welcomeMessage: Message = {
				id: "1",
				text: "Hello! I'm your AI Assistant powered by Google Gemini. I can help you with:\n\n• Answering questions\n• Providing information\n• Having natural conversations\n• And much more!\n\nHow can I assist you today?",
				sender: "agent",
				timestamp: new Date(),
			};
			setMessages([welcomeMessage]);
			// Note: Session ID remains the same for conversation context
			// If you want a new session, refresh the page
		}
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
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
							</div>
							<div>
								<h3 className="font-semibold">AI Assistant</h3>
								<p className="text-xs text-blue-100">
									Powered by Google Gemini 2.5
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={handleClearChat}
								className="text-white/80 hover:text-white transition-colors p-1"
								aria-label="Clear chat history"
								title="Clear chat history"
							>
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
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</button>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="text-white/80 hover:text-white transition-colors p-1"
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
							<input
								ref={inputRef}
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								placeholder="Type a message..."
								className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
								aria-label="Chat message input"
							/>

							<button
								type="submit"
								disabled={!inputText.trim()}
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
