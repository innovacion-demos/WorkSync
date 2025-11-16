/**
 * WebSocket Client Interface
 * Abstract interface for WebSocket implementations
 */

export type ConnectionStatus =
	| "disconnected"
	| "connecting"
	| "connected"
	| "error";

export interface WebSocketMessage {
	topic: string;
	body: string;
}

export interface WebSocketClientConfig {
	url: string;
	reconnectDelay?: number;
	heartbeatIncoming?: number;
	heartbeatOutgoing?: number;
	debug?: boolean;
}

export interface WebSocketClient {
	readonly status: ConnectionStatus;
	connect(): void;
	disconnect(): void;
	subscribe(
		topic: string,
		callback: (message: WebSocketMessage) => void,
	): () => void;
	send(destination: string, body: string): void;
}
