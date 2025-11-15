package org.caixabanktech.mic_issues.infrastructure;

import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.infrastructure.persistence.IssueJpaEntity;
import org.caixabanktech.mic_issues.infrastructure.persistence.UserJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between Domain Entity and JPA Entity
 * Translates between domain and infrastructure layers
 */
@Component
public class IssueMapper {

    private final UserMapper userMapper;

    public IssueMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * Converts domain Issue to JPA Entity using Lombok Builder
     */
    public IssueJpaEntity toJpaEntity(Issue issue) {
        if (issue == null) {
            return null;
        }

        UserJpaEntity assignedUserJpa = null;
        if (issue.getAssignedUser() != null) {
            assignedUserJpa = userMapper.toJpaEntity(issue.getAssignedUser());
        }

        return IssueJpaEntity.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .requester(issue.getRequester())
                .status(issue.getStatus())
                .priority(issue.getPriority())
                .assignedUser(assignedUserJpa)
                .tags(issue.getTags())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }

    /**
     * Converts JPA Entity to domain Issue using Issue Builder
     */
    public Issue toDomain(IssueJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        User assignedUser = null;
        if (jpaEntity.getAssignedUser() != null) {
            assignedUser = userMapper.toDomain(jpaEntity.getAssignedUser());
        }

        return Issue.reconstitute()
                .withId(jpaEntity.getId())
                .withTitle(jpaEntity.getTitle())
                .withDescription(jpaEntity.getDescription())
                .withRequester(jpaEntity.getRequester())
                .withStatus(jpaEntity.getStatus())
                .withPriority(jpaEntity.getPriority())
                .withAssignedUser(assignedUser)
                .withTags(jpaEntity.getTags())
                .withCreatedAt(jpaEntity.getCreatedAt())
                .withUpdatedAt(jpaEntity.getUpdatedAt())
                .build();
    }
}
