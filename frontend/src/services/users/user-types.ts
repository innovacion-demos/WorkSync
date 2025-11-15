/**
 * Backend User Types
 * Types matching the backend UserResponse and related DTOs
 */

/**
 * Backend User Response
 */
export interface BackendUser {
	id: number;
	username: string;
	name: string;
	email: string;
	department: string | null;
}

/**
 * Create User Request
 */
export interface CreateUserRequest {
	username: string;
	password: string;
	name: string;
	email: string;
	department?: string;
}
