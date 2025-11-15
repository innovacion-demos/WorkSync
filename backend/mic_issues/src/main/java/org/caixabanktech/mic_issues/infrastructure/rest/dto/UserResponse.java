package org.caixabanktech.mic_issues.infrastructure.rest.dto;

import org.caixabanktech.mic_issues.domain.entities.User;

/**
 * DTO for user response
 */
public record UserResponse(
        Long id,
        String username,
        String name,
        String email,
        String phone,
        String address,
        String department,
        String createdAt,
        String updatedAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getDepartment(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null
        );
    }
}
