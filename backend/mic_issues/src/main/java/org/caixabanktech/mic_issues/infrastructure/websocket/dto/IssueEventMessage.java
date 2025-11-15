package org.caixabanktech.mic_issues.infrastructure.websocket.dto;

import org.caixabanktech.mic_issues.domain.entities.Issue;

import java.time.LocalDateTime;
import java.util.List;

/**
 * WebSocket DTO for Issue events
 * Sent to all connected clients when issues change
 */
public record IssueEventMessage(
        String eventType,
        Long issueId,
        String title,
        String description,
        String requester,
        String status,
        String priority,
        Long assignedUserId,
        String assignedUsername,
        List<String> tags,
        Long triggeredByUserId,
        LocalDateTime timestamp
) {
    public static IssueEventMessage from(Issue issue, String eventType, Long triggeredByUserId) {
        return new IssueEventMessage(
                eventType,
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getRequester(),
                issue.getStatus().name(),
                issue.getPriority() != null ? issue.getPriority().name() : "NORMAL",
                issue.getAssignedUser() != null ? issue.getAssignedUser().getId() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getUsername() : null,
                issue.getTags(),
                triggeredByUserId,
                LocalDateTime.now()
        );
    }
}
