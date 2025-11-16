/**
 * STOMP WebSocket Client Implementation
 * WebSocket client using STOMP protocol with SockJS fallback
 */

import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type {
	ConnectionStatus,
	WebSocketClient,
	WebSocketClientConfig,
	WebSocketMessage,
} from "./websocket-client";

export class StompWebSocketClient implements WebSocketClient {
	private client: Client | null = null;
	private retryTimer: number | null = null;
	private readonly subscriptions = new Map<
		string,
		Array<(message: WebSocketMessage) => void>
	>();
	private _status: ConnectionStatus = "disconnected";
	private readonly config: WebSocketClientConfig;

	constructor(config: WebSocketClientConfig) {
		this.config = {
			reconnectDelay: 2000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
			debug: false,
			...config,
		};
	}

	get status(): ConnectionStatus {
		return this._status;
	}

	/**
	 * Connect to WebSocket with STOMP protocol
	 */
	connect(): void {
		if (this.client?.connected) {
			return;
		}

		if (this.retryTimer !== null) {
			return;
		}

		this._status = "connecting";

		this.client = new Client({
			webSocketFactory: () => new SockJS(this.config.url),
			debug: this.config.debug ? (str) => console.log("[STOMP Debug]", str) : undefined,
			reconnectDelay: 0,
			heartbeatIncoming: this.config.heartbeatIncoming,
			heartbeatOutgoing: this.config.heartbeatOutgoing,
		});

		this.client.onConnect = () => {
			this._status = "connected";

			if (this.retryTimer !== null) {
				clearTimeout(this.retryTimer);
				this.retryTimer = null;
			}

			this.resubscribeAll();
		};

		this.client.onStompError = () => {
			this._status = "error";
			this.scheduleReconnect();
		};

		this.client.onWebSocketClose = () => {
			this._status = "disconnected";
			this.scheduleReconnect();
		};

		this.client.activate();
	}

	/**
	 * Disconnect from WebSocket
	 */
	disconnect(): void {
		if (this.client) {
			this.client.deactivate();
			this.client = null;
			this._status = "disconnected";
		}

		if (this.retryTimer !== null) {
			clearTimeout(this.retryTimer);
			this.retryTimer = null;
		}
	}

	/**
	 * Subscribe to a topic
	 */
	subscribe(
		topic: string,
		callback: (message: WebSocketMessage) => void,
	): () => void {
		const callbacks = this.subscriptions.get(topic);
		if (callbacks) {
			callbacks.push(callback);
		} else {
			this.subscriptions.set(topic, [callback]);
		}

		if (this.client?.connected) {
			this.subscribeToTopic(topic);
		}

		return () => {
			const callbacks = this.subscriptions.get(topic);
			if (callbacks) {
				const index = callbacks.indexOf(callback);
				if (index > -1) {
					callbacks.splice(index, 1);
				}
				if (callbacks.length === 0) {
					this.subscriptions.delete(topic);
				}
			}
		};
	}

	/**
	 * Send a message to a topic
	 */
	send(destination: string, body: string): void {
		if (!this.client?.connected) {
			return;
		}

		this.client.publish({
			destination,
			body,
		});
	}

	/**
	 * Subscribe to a specific topic on STOMP
	 */
	private subscribeToTopic(topic: string): void {
		if (!this.client?.connected) {
			return;
		}

		this.client.subscribe(topic, (message: IMessage) => {
			const callbacks = this.subscriptions.get(topic);
			if (!callbacks) return;

			const wsMessage: WebSocketMessage = {
				topic,
				body: message.body,
			};

			for (const callback of callbacks) {
				try {
					callback(wsMessage);
				} catch (e) {
					console.error("[StompClient] Callback error:", e);
				}
			}
		});
	}

	/**
	 * Resubscribe to all topics after reconnection
	 */
	private resubscribeAll(): void {
		for (const topic of this.subscriptions.keys()) {
			this.subscribeToTopic(topic);
		}
	}

	/**
	 * Schedule reconnection after delay
	 */
	private scheduleReconnect(): void {
		if (this.retryTimer === null) {
			const delay = this.config.reconnectDelay || 2000;
			this.retryTimer = globalThis.setTimeout(() => {
				this.retryTimer = null;
				this.connect();
			}, delay);
		}
	}
}
