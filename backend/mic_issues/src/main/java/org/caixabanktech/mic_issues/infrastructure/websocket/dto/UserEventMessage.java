package org.caixabanktech.mic_issues.infrastructure.websocket.dto;

import org.caixabanktech.mic_issues.domain.entities.User;

import java.time.LocalDateTime;

/**
 * WebSocket DTO for User events
 * Sent to all connected clients when users change
 */
public record UserEventMessage(
        String eventType,
        Long userId,
        String username,
        String name,
        String email,
        String department,
        LocalDateTime timestamp
) {
    public static UserEventMessage from(User user, String eventType) {
        return new UserEventMessage(
                eventType,
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getDepartment(),
                LocalDateTime.now()
        );
    }
}
