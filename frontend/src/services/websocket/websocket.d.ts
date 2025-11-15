/**
 * WebSocket Event Types
 * Types matching backend WebSocket events
 */

/**
 * Issue Event Types
 */
export type IssueEventType =
	| "CREATED"
	| "UPDATED"
	| "ASSIGNED"
	| "RESOLVED"
	| "CLOSED"
	| "REJECTED"
	| "DELETED";

/**
 * User Event Types
 */
export type UserEventType = "CREATED" | "PROFILE_UPDATED" | "DELETED";

/**
 * Issue Event Message from WebSocket
 * Matches backend: IssueEventMessage.java
 */
export interface IssueEventMessage {
	eventType: IssueEventType;
	issueId: number;
	title: string;
	description: string;
	requester: string;
	status: string; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
	priority: string; // LOW, NORMAL, HIGH, URGENT
	assignedUserId: number | null;
	assignedUsername: string | null;
	tags: string[];
	triggeredByUserId: number | null;
	timestamp: string; // ISO 8601 date string
}

/**
 * User Event Message from WebSocket
 * Matches backend: UserEventMessage.java
 */
export interface UserEventMessage {
	eventType: UserEventType;
	userId: number;
	username: string;
	name: string;
	email: string;
	department: string | null;
	timestamp: string; // ISO 8601 date string
}

/**
 * Generic WebSocket Event
 */
export type WebSocketEvent =
	| {
			type: "issue";
			data: IssueEventMessage;
	  }
	| {
			type: "user";
			data: UserEventMessage;
	  };
