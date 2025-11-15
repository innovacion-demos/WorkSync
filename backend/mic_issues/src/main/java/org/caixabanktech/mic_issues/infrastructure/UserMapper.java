package org.caixabanktech.mic_issues.infrastructure;

import org.caixabanktech.mic_issues.domain.entities.User;
import org.caixabanktech.mic_issues.infrastructure.persistence.UserJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between Domain User Entity and JPA Entity
 * Translates between domain and infrastructure layers
 */
@Component
public class UserMapper {

    /**
     * Converts domain User to JPA Entity
     * Note: Does not map collections to avoid circular dependencies
     */
    public UserJpaEntity toJpaEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserJpaEntity.builder()
                .id(user.getId())
                .username(user.getUsername())
                .password(user.getPassword())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .address(user.getAddress())
                .department(user.getDepartment())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    /**
     * Converts JPA Entity to domain User
     * Note: Does not map collections to avoid circular dependencies and lazy loading issues
     */
    public User toDomain(UserJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        return User.builder()
                .id(jpaEntity.getId())
                .username(jpaEntity.getUsername())
                .password(jpaEntity.getPassword())
                .name(jpaEntity.getName())
                .email(jpaEntity.getEmail())
                .phone(jpaEntity.getPhone())
                .address(jpaEntity.getAddress())
                .department(jpaEntity.getDepartment())
                .createdAt(jpaEntity.getCreatedAt())
                .updatedAt(jpaEntity.getUpdatedAt())
                .build();
    }
}
