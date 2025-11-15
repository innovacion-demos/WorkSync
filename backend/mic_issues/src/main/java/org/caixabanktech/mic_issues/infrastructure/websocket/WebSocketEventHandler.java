package org.caixabanktech.mic_issues.infrastructure.websocket;

import lombok.extern.slf4j.Slf4j;
import org.caixabanktech.mic_issues.domain.events.IssueEvent;
import org.caixabanktech.mic_issues.domain.events.UserEvent;
import org.caixabanktech.mic_issues.infrastructure.websocket.dto.IssueEventMessage;
import org.caixabanktech.mic_issues.infrastructure.websocket.dto.UserEventMessage;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * WebSocket Event Handler
 * Listens to domain events and broadcasts them to WebSocket clients
 */
@Slf4j
@Component
public class WebSocketEventHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Listens for IssueEvent and broadcasts to all clients subscribed to /topic/issues
     */
    @EventListener
    public void handleIssueEvent(IssueEvent event) {
        log.info("Broadcasting issue event: {} for issue ID: {}",
                event.getEventType(), event.getIssue().getId());

        IssueEventMessage message = IssueEventMessage.from(
                event.getIssue(),
                event.getEventType().name(),
                event.getUserId()
        );

        // Broadcast to all clients subscribed to /topic/issues
        messagingTemplate.convertAndSend("/topic/issues", message);

        // Also send to specific issue topic for clients watching a specific issue
        messagingTemplate.convertAndSend(
                "/topic/issues/" + event.getIssue().getId(),
                message
        );
    }

    /**
     * Listens for UserEvent and broadcasts to all clients subscribed to /topic/users
     */
    @EventListener
    public void handleUserEvent(UserEvent event) {
        log.info("Broadcasting user event: {} for user ID: {}",
                event.getEventType(), event.getUser().getId());

        UserEventMessage message = UserEventMessage.from(
                event.getUser(),
                event.getEventType().name()
        );

        // Broadcast to all clients subscribed to /topic/users
        messagingTemplate.convertAndSend("/topic/users", message);

        // Also send to specific user topic for clients watching a specific user
        messagingTemplate.convertAndSend(
                "/topic/users/" + event.getUser().getId(),
                message
        );
    }
}
