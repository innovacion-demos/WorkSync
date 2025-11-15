package org.caixabanktech.mic_issues.infrastructure.rest.dto;

import org.caixabanktech.mic_issues.domain.entities.Issue;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for issue response
 */
public record IssueResponse(
        Long id,
        String title,
        String description,
        String requester,
        String status,
        String priority,
        Long assignedUserId,
        String assignedUsername,
        List<String> tags,
        String createdAt,
        String updatedAt
) {
    public static IssueResponse from(Issue issue) {
        return new IssueResponse(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getRequester(),
                issue.getStatus().name(),
                issue.getPriority() != null ? issue.getPriority().name() : "NORMAL",
                issue.getAssignedUser() != null ? issue.getAssignedUser().getId() : null,
                issue.getAssignedUser() != null ? issue.getAssignedUser().getUsername() : null,
                issue.getTags() != null ? issue.getTags() : new ArrayList<>(),
                issue.getCreatedAt() != null ? issue.getCreatedAt().toString() : null,
                issue.getUpdatedAt() != null ? issue.getUpdatedAt().toString() : null
        );
    }
}
