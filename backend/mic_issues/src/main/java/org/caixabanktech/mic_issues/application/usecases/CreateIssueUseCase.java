package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.IssuePriority;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.domain.events.IssueEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Use Case: Create a new Issue
 * Orchestrates the creation of an issue in the system
 */
@Service
public class CreateIssueUseCase {

    private final IssueRepository issueRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final GetUserByIdUseCase getUserByIdUseCase;

    public CreateIssueUseCase(IssueRepository issueRepository,
                             ApplicationEventPublisher eventPublisher,
                             GetUserByIdUseCase getUserByIdUseCase) {
        this.issueRepository = issueRepository;
        this.eventPublisher = eventPublisher;
        this.getUserByIdUseCase = getUserByIdUseCase;
    }

    /**
     * Creates a new issue with full details
     *
     * @param title the issue title
     * @param description the issue description
     * @param requester the person requesting the issue
     * @param priorityStr the priority level (LOW, NORMAL, HIGH, URGENT)
     * @param tags list of tags for categorization
     * @param assignedUserId optional user ID to assign the issue to
     * @return the created issue with generated ID
     */
    public Issue execute(String title, String description, String requester,
                        String priorityStr, List<String> tags, Long assignedUserId) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be empty");
        }

        IssuePriority priority;
        try {
            priority = priorityStr != null ? IssuePriority.valueOf(priorityStr.toUpperCase()) : IssuePriority.NORMAL;
        } catch (IllegalArgumentException e) {
            priority = IssuePriority.NORMAL;
        }

        User assignedUser = null;
        if (assignedUserId != null) {
            assignedUser = getUserByIdUseCase.execute(assignedUserId);
        }

        Issue issue = Issue.create(title, description, requester, priority, tags, assignedUser);
        Issue savedIssue = issueRepository.save(issue);

        eventPublisher.publishEvent(new IssueEvent(this, savedIssue, IssueEvent.EventType.CREATED, null));

        return savedIssue;
    }
}
