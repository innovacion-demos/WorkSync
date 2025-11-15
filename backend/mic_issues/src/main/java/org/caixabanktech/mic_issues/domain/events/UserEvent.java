package org.caixabanktech.mic_issues.domain.events;

import lombok.Getter;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.springframework.context.ApplicationEvent;

/**
 * Domain Event - User Event
 * Published when users are created, updated, or deleted
 */
@Getter
public class UserEvent extends ApplicationEvent {

    private final User user;
    private final EventType eventType;

    public UserEvent(Object source, User user, EventType eventType) {
        super(source);
        this.user = user;
        this.eventType = eventType;
    }

    public enum EventType {
        CREATED,
        UPDATED,
        DELETED,
        PROFILE_UPDATED
    }
}
