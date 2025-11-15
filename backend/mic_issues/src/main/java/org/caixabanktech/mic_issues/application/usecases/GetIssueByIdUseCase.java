package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.springframework.stereotype.Service;

/**
 * Use Case: Get an Issue by ID
 * Retrieves a specific issue from the system
 */
@Service
public class GetIssueByIdUseCase {

    private final IssueRepository issueRepository;

    public GetIssueByIdUseCase(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    /**
     * Retrieves an issue by its ID
     *
     * @param id the issue ID
     * @return the issue if found
     * @throws IssueNotFoundException if issue doesn't exist
     */
    public Issue execute(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Issue ID cannot be null");
        }

        return issueRepository.findById(id)
                .orElseThrow(() -> new IssueNotFoundException("Issue not found with id: " + id));
    }

    /**
     * Custom exception for when an issue is not found
     */
    public static class IssueNotFoundException extends RuntimeException {
        public IssueNotFoundException(String message) {
            super(message);
        }
    }
}
