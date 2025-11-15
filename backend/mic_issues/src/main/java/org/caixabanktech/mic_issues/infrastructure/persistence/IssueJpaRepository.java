package org.caixabanktech.mic_issues.infrastructure.persistence;

import org.caixabanktech.mic_issues.domain.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository
 * Infrastructure implementation
 */
@Repository
public interface IssueJpaRepository extends JpaRepository<IssueJpaEntity, Long> {

    List<IssueJpaEntity> findByStatus(IssueStatus status);

    List<IssueJpaEntity> findByAssignedUserId(Long userId);
}
