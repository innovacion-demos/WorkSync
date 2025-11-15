package org.caixabanktech.mic_issues.infrastructure.rest.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO for creating a new issue
 */
public record CreateIssueRequest(
        String title,
        String description,
        String requester,
        String priority,
        List<String> tags,
        Long assignedUserId
) {
    // Constructor with defaults for optional fields
    public CreateIssueRequest {
        requester = requester != null ? requester : "Unknown";
        priority = priority != null ? priority : "NORMAL";
        tags = tags != null ? tags : new ArrayList<>();
        // assignedUserId can be null (unassigned)
    }
}
