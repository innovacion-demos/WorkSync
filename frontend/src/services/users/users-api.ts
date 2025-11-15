/**
 * Users API
 * REST API operations for users
 */

import { API_CONFIG, ENDPOINTS } from "@/services/config";
import type { BackendUser } from "@/services/users/user-types";

/**
 * Users API Service
 */
export const usersApi = {
	/**
	 * Fetch all users
	 */
	async fetchAll(department?: string): Promise<BackendUser[]> {
		try {
			const endpoint = department
				? ENDPOINTS.USERS.BY_DEPARTMENT(department)
				: ENDPOINTS.USERS.BASE;

			const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return await response.json();
		} catch (error) {
			console.error("[UsersAPI] Failed to fetch users:", error);
			return [];
		}
	},
};
