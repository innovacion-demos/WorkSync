package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.springframework.stereotype.Service;

/**
 * Use Case: Delete a User
 * Removes a user from the system
 */
@Service
public class DeleteUserUseCase {

    private final UserRepository userRepository;

    public DeleteUserUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Deletes a user by ID
     *
     * @param id the user ID to delete
     * @throws GetUserByIdUseCase.UserNotFoundException if user doesn't exist
     */
    public void execute(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        if (!userRepository.existsById(id)) {
            throw new GetUserByIdUseCase.UserNotFoundException("User not found with id: " + id);
        }

        userRepository.deleteById(id);
    }
}
