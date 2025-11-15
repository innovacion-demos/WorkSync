package org.caixabanktech.mic_issues.domain.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.caixabanktech.mic_issues.domain.IssueStatus;
import org.caixabanktech.mic_issues.domain.IssuePriority;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Domain Entity - Issue
 * Pure domain model without any infrastructure concerns (no JPA annotations)
 * Following DDD principles
 */
@Getter
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"collaborators"})
public class Issue {

    private Long id;
    private String title;
    private String description;
    private String requester;
    private IssueStatus status;
    private IssuePriority priority;
    private User assignedUser;
    private Set<User> collaborators;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Private constructor for builder pattern
    private Issue() {
        this.collaborators = new HashSet<>();
        this.tags = new ArrayList<>();
    }

    // Factory method for creating new issues
    public static Issue create(String title, String description, String requester,
                               IssuePriority priority, List<String> tags, User assignedUser) {
        Issue issue = new Issue();
        issue.title = title;
        issue.description = description;
        issue.requester = requester != null ? requester : "Unknown";
        issue.status = assignedUser != null ? IssueStatus.IN_PROGRESS : IssueStatus.OPEN;
        issue.priority = priority != null ? priority : IssuePriority.NORMAL;
        issue.assignedUser = assignedUser;
        issue.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
        issue.createdAt = LocalDateTime.now();
        return issue;
    }

    // Factory method for reconstituting from persistence - Builder pattern
    public static @NotNull IssueBuilder reconstitute() {
        return new IssueBuilder();
    }

    /**
     * Builder for reconstituting Issue from persistence
     */
    public static class IssueBuilder {
        private final Issue issue;

        private IssueBuilder() {
            this.issue = new Issue();
        }

        public IssueBuilder withId(Long id) {
            issue.id = id;
            return this;
        }

        public IssueBuilder withTitle(String title) {
            issue.title = title;
            return this;
        }

        public IssueBuilder withDescription(String description) {
            issue.description = description;
            return this;
        }

        public IssueBuilder withRequester(String requester) {
            issue.requester = requester;
            return this;
        }

        public IssueBuilder withStatus(IssueStatus status) {
            issue.status = status;
            return this;
        }

        public IssueBuilder withPriority(IssuePriority priority) {
            issue.priority = priority != null ? priority : IssuePriority.NORMAL;
            return this;
        }

        public IssueBuilder withAssignedUser(User assignedUser) {
            issue.assignedUser = assignedUser;
            return this;
        }

        public IssueBuilder withTags(List<String> tags) {
            issue.tags = tags != null ? new ArrayList<>(tags) : new ArrayList<>();
            return this;
        }

        public IssueBuilder withCreatedAt(LocalDateTime createdAt) {
            issue.createdAt = createdAt;
            return this;
        }

        public IssueBuilder withUpdatedAt(LocalDateTime updatedAt) {
            issue.updatedAt = updatedAt;
            return this;
        }

        public Issue build() {
            return issue;
        }
    }

    // Business methods
    public void assign(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.assignedUser = user;
        this.status = IssueStatus.IN_PROGRESS;
        this.updatedAt = LocalDateTime.now();
    }

    public void unassign() {
        this.assignedUser = null;
        this.status = IssueStatus.OPEN;
        this.updatedAt = LocalDateTime.now();
    }

    public void addCollaborator(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.collaborators.add(user);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeCollaborator(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        this.collaborators.remove(user);
        this.updatedAt = LocalDateTime.now();
    }

    public void resolve() {
        if (this.status != IssueStatus.IN_PROGRESS) {
            throw new IllegalStateException("Only in-progress issues can be resolved");
        }
        this.status = IssueStatus.RESOLVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void close() {
        if (this.status != IssueStatus.RESOLVED) {
            throw new IllegalStateException("Only resolved issues can be closed");
        }
        this.status = IssueStatus.CLOSED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject(String reason) {
        this.status = IssueStatus.REJECTED;
        this.description = this.description + "\n\nRejection reason: " + reason;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDetails(String title, String description) {
        this.title = title;
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateStatus(IssueStatus newStatus) {
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();
    }

    // Custom getter for defensive copying of collections
    public Set<User> getCollaborators() {
        return new HashSet<>(collaborators);
    }
}
