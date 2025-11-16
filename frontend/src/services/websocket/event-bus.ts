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

	connect(): void {
		if (this.isInitialized) {
			return;
		}

		this.isInitialized = true;

		this.client.subscribe(TOPICS.ISSUES, (message) => {
			try {
				const event: IssueEventMessage = JSON.parse(message.body);
				this.notifyIssueListeners(event);
			} catch (err) {
				console.error("[EventBus] Failed to parse issue event:", err);
			}
		});

		this.client.connect();
	}

	disconnect(): void {
		this.client.disconnect();
		this.isInitialized = false;
	}

	subscribeToIssues(listener: IssueEventListener): () => void {
		this.issueListeners = [...this.issueListeners, listener];
		return () => {
			this.issueListeners = this.issueListeners.filter((l) => l !== listener);
		};
	}

	private notifyIssueListeners(event: IssueEventMessage): void {
		for (const listener of this.issueListeners) {
			try {
				listener(event);
			} catch (e) {
				console.error("[EventBus] Issue listener threw:", e);
			}
		}
	}

	get status() {
		return this.client.status;
	}
}

export const eventBus = new EventBus();
