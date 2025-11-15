package org.caixabanktech.mic_issues.infrastructure.rest.dto;

/**
 * DTO for creating a new user
 */
public record CreateUserRequest(String username, String password, String name, String email) {
}
