package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.springframework.stereotype.Service;

/**
 * Use Case: Get a User by ID
 * Retrieves a specific user from the system
 */
@Service
public class GetUserByIdUseCase {

    private final UserRepository userRepository;

    public GetUserByIdUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a user by its ID
     *
     * @param id the user ID
     * @return the user if found
     * @throws UserNotFoundException if user doesn't exist
     */
    public User execute(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }

    /**
     * Custom exception for when a user is not found
     */
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
}
