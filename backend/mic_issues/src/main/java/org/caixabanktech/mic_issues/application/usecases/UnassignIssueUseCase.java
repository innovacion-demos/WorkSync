package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.events.IssueEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Use Case: Unassign Issue
 * Removes the assigned user from an issue and changes status back to OPEN
 */
@Service
public class UnassignIssueUseCase {

    private final IssueRepository issueRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UnassignIssueUseCase(IssueRepository issueRepository,
                                ApplicationEventPublisher eventPublisher) {
        this.issueRepository = issueRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Unassigns an issue
     *
     * @param issueId the issue ID
     * @param userId the user triggering the unassignment
     * @return the updated issue
     * @throws IssueNotFoundException if issue doesn't exist
     */
    public Issue execute(Long issueId, Long userId) {
        // Find issue
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IssueNotFoundException("Issue not found with id: " + issueId));

        // Unassign the issue (sets assignedUser to null and status to OPEN)
        issue.unassign();

        // Save updated issue
        Issue updatedIssue = issueRepository.save(issue);

        // Publish event for real-time updates
        eventPublisher.publishEvent(
            new IssueEvent(this, updatedIssue, IssueEvent.EventType.UPDATED, userId)
        );

        return updatedIssue;
    }

    public static class IssueNotFoundException extends RuntimeException {
        public IssueNotFoundException(String message) {
            super(message);
        }
    }
}
