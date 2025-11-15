package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.domain.events.UserEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

/**
 * Use Case: Update User Profile
 * Updates an existing user's information
 */
@Service
public class UpdateUserUseCase {

    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public UpdateUserUseCase(UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    /**
     * Updates a user's profile information
     *
     * @param userId the ID of the user to update
     * @param name the user's new name
     * @param email the user's new email
     * @param phone the user's phone number
     * @param address the user's address
     * @param department the user's department
     * @return the updated user
     * @throws GetUserByIdUseCase.UserNotFoundException if user doesn't exist
     */
    public User execute(Long userId, String name, String email, String phone, String address, String department) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        // Retrieve the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GetUserByIdUseCase.UserNotFoundException(
                        "User not found with id: " + userId));

        // Check email uniqueness if changed
        if (email != null && !email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }

        // Use domain method to update profile
        user.updateProfile(name, email, phone, address, department);

        // Save
        User updatedUser = userRepository.save(user);

        // Publish event for real-time updates
        eventPublisher.publishEvent(new UserEvent(this, updatedUser, UserEvent.EventType.PROFILE_UPDATED));

        return updatedUser;
    }
}
