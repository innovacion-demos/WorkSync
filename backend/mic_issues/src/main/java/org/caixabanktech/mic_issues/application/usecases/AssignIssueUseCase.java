package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.domain.events.IssueEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Use Case: Assign an Issue to a User
 * Assigns an existing issue to a user, changing its status to IN_PROGRESS
 */
@Service
public class AssignIssueUseCase {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public AssignIssueUseCase(
        IssueRepository issueRepository,
        UserRepository userRepository,
        ApplicationEventPublisher eventPublisher
    ) {
        this.issueRepository = issueRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Assigns an issue to a specific user
     *
     * @param issueId the ID of the issue to assign
     * @param userId the ID of the user to assign the issue to
     * @return the updated issue
     * @throws GetIssueByIdUseCase.IssueNotFoundException if issue doesn't exist
     * @throws GetUserByIdUseCase.UserNotFoundException if user doesn't exist
     */
    public Issue execute(Long issueId, Long userId) {
        if (issueId == null) {
            throw new IllegalArgumentException("Issue ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        // Retrieve the issue
        Issue issue = issueRepository
            .findById(issueId)
            .orElseThrow(() ->
                new GetIssueByIdUseCase.IssueNotFoundException(
                    "Issue not found with id: " + issueId
                )
            );

        // Retrieve the user
        User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                new GetUserByIdUseCase.UserNotFoundException(
                    "User not found with id: " + userId
                )
            );

        // Use domain method to assign (business logic in domain)
        issue.assign(user);

        // Save
        Issue updatedIssue = issueRepository.save(issue);

        // Publish event for real-time updates
        eventPublisher.publishEvent(
            new IssueEvent(
                this,
                updatedIssue,
                IssueEvent.EventType.ASSIGNED,
                userId
            )
        );

        return updatedIssue;
    }
}
