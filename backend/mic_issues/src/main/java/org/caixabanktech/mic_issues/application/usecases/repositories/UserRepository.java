package org.caixabanktech.mic_issues.application.usecases.repositories;

import org.caixabanktech.mic_issues.domain.entities.User;

import java.util.List;
import java.util.Optional;

/**
 * Repository Port (Interface) - Application Layer
 * Defines the contract for User persistence
 * Implementation will be in the infrastructure layer
 */
public interface UserRepository {

    User save(User user);

    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    List<User> findByDepartment(String department);

    void deleteById(Long id);

    boolean existsById(Long id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
