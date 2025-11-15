package org.caixabanktech.mic_issues.domain.events;

import lombok.Getter;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.springframework.context.ApplicationEvent;

/**
 * Domain Event - Issue Event
 * Published when issues are created, updated, or deleted
 */
@Getter
public class IssueEvent extends ApplicationEvent {

    private final Issue issue;
    private final EventType eventType;
    private final Long userId; // User who triggered the event

    public IssueEvent(Object source, Issue issue, EventType eventType, Long userId) {
        super(source);
        this.issue = issue;
        this.eventType = eventType;
        this.userId = userId;
    }

    public enum EventType {
        CREATED,
        UPDATED,
        ASSIGNED,
        RESOLVED,
        CLOSED,
        REJECTED,
        DELETED
    }
}
