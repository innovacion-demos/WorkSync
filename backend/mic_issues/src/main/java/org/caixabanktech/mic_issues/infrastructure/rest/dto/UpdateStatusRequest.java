package org.caixabanktech.mic_issues.infrastructure.rest.dto;

/**
 * DTO for updating issue status
 */
public record UpdateStatusRequest(String status, Long userId) {
}
