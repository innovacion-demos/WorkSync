package org.caixabanktech.mic_issues.application.usecases;

import lombok.extern.slf4j.Slf4j;
import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.IssueStatus;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.events.IssueEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Use Case: Update Issue Status
 * Changes the status of an issue and publishes event
 */
@Slf4j
@Service
public class UpdateIssueStatusUseCase {

    private final IssueRepository issueRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UpdateIssueStatusUseCase(IssueRepository issueRepository,
                                   ApplicationEventPublisher eventPublisher) {
        this.issueRepository = issueRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Updates the status of an issue
     *
     * @param issueId the issue ID
     * @param newStatus the new status
     * @param userId the user triggering the change
     * @return the updated issue
     * @throws IssueNotFoundException if issue doesn't exist
     */
    public Issue execute(Long issueId, IssueStatus newStatus, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IssueNotFoundException("Issue not found with id: " + issueId));

        try {
            switch (newStatus) {
                case RESOLVED -> issue.resolve();
                case CLOSED -> issue.close();
                case REJECTED -> issue.reject("Status changed to rejected via UI");
                case IN_PROGRESS, OPEN -> {
                    // For IN_PROGRESS and OPEN, use the generic status updater
                    // These don't have specific domain rules like resolve/close
                    issue.updateStatus(newStatus);
                }
            }
        } catch (IllegalStateException e) {
            // If domain rules don't allow the status change, force it anyway
            // This provides flexibility for manual status changes
            log.warn("Bypassing domain rules - forcing status change: {}", e.getMessage());
            issue.updateStatus(newStatus);
        }

        Issue updatedIssue = issueRepository.save(issue);

        IssueEvent.EventType eventType = switch (newStatus) {
            case RESOLVED -> IssueEvent.EventType.RESOLVED;
            case CLOSED -> IssueEvent.EventType.CLOSED;
            case REJECTED -> IssueEvent.EventType.REJECTED;
            default -> IssueEvent.EventType.UPDATED;
        };

        eventPublisher.publishEvent(
            new IssueEvent(this, updatedIssue, eventType, userId)
        );

        return updatedIssue;
    }

    public static class IssueNotFoundException extends RuntimeException {
        public IssueNotFoundException(String message) {
            super(message);
        }
    }
}
