package org.caixabanktech.mic_issues.infrastructure;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.IssueStatus;
import org.caixabanktech.mic_issues.infrastructure.persistence.IssueJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Adapter implementing the application repository port
 * Bridges the application layer with the infrastructure layer
 */
@Component
public class IssueRepositoryAdapter implements IssueRepository {

    private final IssueJpaRepository jpaRepository;
    private final IssueMapper mapper;

    public IssueRepositoryAdapter(IssueJpaRepository jpaRepository, IssueMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Issue save(Issue issue) {
        var jpaEntity = mapper.toJpaEntity(issue);
        var savedEntity = jpaRepository.save(jpaEntity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Issue> findById(Long id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public List<Issue> findAll() {
        return jpaRepository.findAll()
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Issue> findByStatus(IssueStatus status) {
        return jpaRepository.findByStatus(status)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public List<Issue> findByAssignedUserId(Long userId) {
        return jpaRepository.findByAssignedUserId(userId)
                .stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaRepository.existsById(id);
    }
}
