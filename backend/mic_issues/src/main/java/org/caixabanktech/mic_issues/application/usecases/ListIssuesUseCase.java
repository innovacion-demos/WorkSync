package org.caixabanktech.mic_issues.application.usecases;

import org.caixabanktech.mic_issues.application.usecases.repositories.IssueRepository;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Use Case: List all Issues
 * Retrieves all issues in the system
 */
@Service
public class ListIssuesUseCase {

    private final IssueRepository issueRepository;

    public ListIssuesUseCase(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    /**
     * Retrieves all issues
     *
     * @return list of all issues
     */
    public List<Issue> execute() {
        return issueRepository.findAll();
    }
}
