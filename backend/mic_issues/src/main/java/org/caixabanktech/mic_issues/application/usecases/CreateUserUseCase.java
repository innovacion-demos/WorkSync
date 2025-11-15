package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.domain.events.UserEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Use Case: Create a new User
 * Orchestrates the creation of a user in the system
 */
@Service
public class CreateUserUseCase {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CreateUserUseCase(UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Creates a new user with the provided information
     *
     * @param username the unique username
     * @param password the user password
     * @param name the user's full name
     * @param email the user's email address
     * @return the created user with generated ID
     */
    public User execute(String username, String password, String name, String email) {
        // Validation
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        // Check for duplicates
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        // Create domain entity using factory method
        User user = User.create(username, password, name, email);

        // Save
        User savedUser = userRepository.save(user);

        // Publish event for real-time updates
        eventPublisher.publishEvent(new UserEvent(this, savedUser, UserEvent.EventType.CREATED));

        return savedUser;
    }
}
