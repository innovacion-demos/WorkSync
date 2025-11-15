package org.caixabanktech.mic_issues.infrastructure.rest.dto;

/**
 * DTO for updating user profile
 */
public record UpdateUserRequest(String name, String email, String phone, String address, String department) {
}
