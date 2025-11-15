package org.caixabanktech.mic_issues.domain.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Domain Entity - User
 * Pure domain model without any infrastructure concerns (no JPA annotations)
 * Following DDD principles
 */
@Getter
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"password", "assignedIssues", "collaboratingIssues"})
public class User {

    private Long id;
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String department;
    private Set<Issue> assignedIssues;
    private Set<Issue> collaboratingIssues;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Private constructor for builder pattern
    private User() {
        this.assignedIssues = new HashSet<>();
        this.collaboratingIssues = new HashSet<>();
    }

    // Factory method for creating new users
    public static User create(String username, String password, String name, String email) {
        User user = new User();
        user.username = username;
        user.password = password;
        user.name = name;
        user.email = email;
        user.createdAt = LocalDateTime.now();
        return user;
    }

    // Factory method for reconstituting from persistence - Builder pattern
    public static @NotNull UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private final User user;

        private UserBuilder() {
            this.user = new User();
        }

        public UserBuilder id(Long id) {
            user.id = id;
            return this;
        }

        public UserBuilder username(String username) {
            user.username = username;
            return this;
        }

        public UserBuilder password(String password) {
            user.password = password;
            return this;
        }

        public UserBuilder name(String name) {
            user.name = name;
            return this;
        }

        public UserBuilder email(String email) {
            user.email = email;
            return this;
        }

        public UserBuilder phone(String phone) {
            user.phone = phone;
            return this;
        }

        public UserBuilder address(String address) {
            user.address = address;
            return this;
        }

        public UserBuilder department(String department) {
            user.department = department;
            return this;
        }

        public UserBuilder createdAt(LocalDateTime createdAt) {
            user.createdAt = createdAt;
            return this;
        }

        public UserBuilder updatedAt(LocalDateTime updatedAt) {
            user.updatedAt = updatedAt;
            return this;
        }

        public User build() {
            return user;
        }
    }

    // Business methods
    public void updateProfile(String name, String email, String phone, String address, String department) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.department = department;
        this.updatedAt = LocalDateTime.now();
    }

    public void changePassword(String newPassword) {
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        this.password = newPassword;
        this.updatedAt = LocalDateTime.now();
    }

    public void assignIssue(Issue issue) {
        if (issue == null) {
            throw new IllegalArgumentException("Issue cannot be null");
        }
        this.assignedIssues.add(issue);
        this.updatedAt = LocalDateTime.now();
    }

    public void unassignIssue(Issue issue) {
        if (issue == null) {
            throw new IllegalArgumentException("Issue cannot be null");
        }
        this.assignedIssues.remove(issue);
        this.updatedAt = LocalDateTime.now();
    }

    public void addCollaboratingIssue(Issue issue) {
        if (issue == null) {
            throw new IllegalArgumentException("Issue cannot be null");
        }
        this.collaboratingIssues.add(issue);
        this.updatedAt = LocalDateTime.now();
    }

    public void removeCollaboratingIssue(Issue issue) {
        if (issue == null) {
            throw new IllegalArgumentException("Issue cannot be null");
        }
        this.collaboratingIssues.remove(issue);
        this.updatedAt = LocalDateTime.now();
    }

    // Custom getters for defensive copying of collections
    public Set<Issue> getAssignedIssues() {
        return new HashSet<>(assignedIssues);
    }

    public Set<Issue> getCollaboratingIssues() {
        return new HashSet<>(collaboratingIssues);
    }
}
