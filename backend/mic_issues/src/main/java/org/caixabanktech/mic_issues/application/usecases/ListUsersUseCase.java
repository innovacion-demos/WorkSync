package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.UserRepository;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Use Case: List All Users
 * Retrieves all users from the system
 */
@Service
public class ListUsersUseCase {

    private final UserRepository userRepository;

    public ListUsersUseCase(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves all users
     *
     * @return list of all users
     */
    public List<User> execute() {
        return userRepository.findAll();
    }

    /**
     * Retrieves users by department
     *
     * @param department the department name
     * @return list of users in the specified department
     */
    public List<User> executeByDepartment(String department) {
        if (department == null || department.trim().isEmpty()) {
            throw new IllegalArgumentException("Department cannot be empty");
        }
        return userRepository.findByDepartment(department);
    }
}
