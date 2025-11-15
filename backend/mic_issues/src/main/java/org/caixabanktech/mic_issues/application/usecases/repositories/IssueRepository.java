package org.caixabanktech.mic_issues.application.usecases.repositories;

import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.IssueStatus;

import java.util.List;
import java.util.Optional;

/**
 * Repository Port (Interface) - Application Layer
 * Defines the contract for Issue persistence
 * Implementation will be in the infrastructure layer
 */
public interface IssueRepository {

    Issue save(Issue issue);

    Optional<Issue> findById(Long id);

    List<Issue> findAll();

    List<Issue> findByStatus(IssueStatus status);

    List<Issue> findByAssignedUserId(Long userId);

    void deleteById(Long id);

    boolean existsById(Long id);
}
