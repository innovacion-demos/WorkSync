/**
 * Event Bus
 * Pub/Sub system for WebSocket events with type-safe subscriptions
 */

import { StompWebSocketClient } from "./stomp-client";
import type { IssueEventMessage } from "./websocket";

type IssueEventListener = (event: IssueEventMessage) => void;

const WEBSOCKET_CONFIG = {
	url: "http://localhost:8080/ws",
	reconnectDelay: 2000,
	heartbeatIncoming: 4000,
	heartbeatOutgoing: 4000,
	debug: true,
} as const;

const TOPICS = {
	ISSUES: "/topic/issues",
} as const;

class EventBus {
	private readonly client: StompWebSocketClient;
	private issueListeners: IssueEventListener[] = [];
	private isInitialized = false;

	constructor() {
		this.client = new StompWebSocketClient(WEBSOCKET_CONFIG);
	}

	/**
	 * Connect to WebSocket and set up subscriptions
	 */
	connect(): void {
		if (this.isInitialized) {
			console.log("[EventBus] Already initialized");
			return;
		}

		console.log("[EventBus] Connecting...");
		this.isInitialized = true;

		this.client.subscribe(TOPICS.ISSUES, (message) => {
			try {
				const event: IssueEventMessage = JSON.parse(message.body);
				console.log("[EventBus] Received Issue Event:", event);
				this.notifyIssueListeners(event);
			} catch (err) {
				console.error("[EventBus] Failed to parse issue event:", err);
			}
		});

		this.client.connect();
	}

	/**
	 * Disconnect from WebSocket
	 */
	disconnect(): void {
		console.log("[EventBus] Disconnecting...");
		this.client.disconnect();
		this.isInitialized = false;
	}

	/**
	 * Subscribe to issue events
	 * @returns Unsubscribe function
	 */
	subscribeToIssues(listener: IssueEventListener): () => void {
		this.issueListeners = [...this.issueListeners, listener];
		return () => {
			this.issueListeners = this.issueListeners.filter((l) => l !== listener);
		};
	}

	/**
	 * Notify all issue listeners
	 */
	private notifyIssueListeners(event: IssueEventMessage): void {
		for (const listener of this.issueListeners) {
			try {
				listener(event);
			} catch (e) {
				console.error("[EventBus] Issue listener threw:", e);
			}
		}
	}

	/**
	 * Get connection status
	 */
	get status() {
		return this.client.status;
	}
}

export const eventBus = new EventBus();
