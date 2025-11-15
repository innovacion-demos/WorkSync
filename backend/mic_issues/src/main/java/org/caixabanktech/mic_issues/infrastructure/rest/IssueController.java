package org.caixabanktech.mic_issues.infrastructure.rest;

import lombok.extern.slf4j.Slf4j;
import org.caixabanktech.mic_issues.application.usecases.AssignIssueUseCase;
import org.caixabanktech.mic_issues.application.usecases.CreateIssueUseCase;
import org.caixabanktech.mic_issues.application.usecases.GetIssueByIdUseCase;
import org.caixabanktech.mic_issues.application.usecases.GetUserByIdUseCase;
import org.caixabanktech.mic_issues.application.usecases.ListIssuesUseCase;
import org.caixabanktech.mic_issues.application.usecases.UnassignIssueUseCase;
import org.caixabanktech.mic_issues.application.usecases.UpdateIssueStatusUseCase;
import org.caixabanktech.mic_issues.domain.IssueStatus;
import org.caixabanktech.mic_issues.domain.entities.Issue;
import org.caixabanktech.mic_issues.infrastructure.rest.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Issue management
 * Primary Adapter - translates HTTP requests to use case calls
 */
@Slf4j
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final CreateIssueUseCase createIssueUseCase;
    private final GetIssueByIdUseCase getIssueByIdUseCase;
    private final AssignIssueUseCase assignIssueUseCase;
    private final UnassignIssueUseCase unassignIssueUseCase;
    private final ListIssuesUseCase listIssuesUseCase;
    private final UpdateIssueStatusUseCase updateIssueStatusUseCase;

    public IssueController(CreateIssueUseCase createIssueUseCase,
                          GetIssueByIdUseCase getIssueByIdUseCase,
                          AssignIssueUseCase assignIssueUseCase,
                          UnassignIssueUseCase unassignIssueUseCase,
                          ListIssuesUseCase listIssuesUseCase,
                          UpdateIssueStatusUseCase updateIssueStatusUseCase) {
        this.createIssueUseCase = createIssueUseCase;
        this.getIssueByIdUseCase = getIssueByIdUseCase;
        this.assignIssueUseCase = assignIssueUseCase;
        this.unassignIssueUseCase = unassignIssueUseCase;
        this.listIssuesUseCase = listIssuesUseCase;
        this.updateIssueStatusUseCase = updateIssueStatusUseCase;
    }

    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(@RequestBody CreateIssueRequest request) {
        Issue issue = createIssueUseCase.execute(
                request.title(),
                request.description(),
                request.requester(),
                request.priority(),
                request.tags(),
                request.assignedUserId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(IssueResponse.from(issue));
    }

    @GetMapping
    public ResponseEntity<List<IssueResponse>> listIssues() {
        List<Issue> issues = listIssuesUseCase.execute();
        List<IssueResponse> response = issues.stream()
                .map(IssueResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueResponse> getIssueById(@PathVariable Long id) {
        Issue issue = getIssueByIdUseCase.execute(id);
        return ResponseEntity.ok(IssueResponse.from(issue));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IssueResponse> assignIssue(@PathVariable Long id,
                                                     @RequestBody AssignIssueRequest request) {
        Issue issue = assignIssueUseCase.execute(id, request.userId());
        return ResponseEntity.ok(IssueResponse.from(issue));
    }

    @PutMapping("/{id}/unassign")
    public ResponseEntity<IssueResponse> unassignIssue(@PathVariable Long id,
                                                       @RequestBody(required = false) UnassignIssueRequest request) {
        Long userId = (request != null && request.userId() != null) ? request.userId() : 0L;
        Issue issue = unassignIssueUseCase.execute(id, userId);
        return ResponseEntity.ok(IssueResponse.from(issue));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IssueResponse> updateStatus(@PathVariable Long id,
                                                      @RequestBody UpdateStatusRequest request) {
        IssueStatus newStatus = IssueStatus.valueOf(request.status().toUpperCase());
        Issue issue = updateIssueStatusUseCase.execute(id, newStatus, request.userId());
        return ResponseEntity.ok(IssueResponse.from(issue));
    }

    @ExceptionHandler(GetUserByIdUseCase.UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(GetUserByIdUseCase.UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(GetIssueByIdUseCase.IssueNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleIssueNotFound(GetIssueByIdUseCase.IssueNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
    }

    // Business rule violations
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(UpdateIssueStatusUseCase.IssueNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleStatusUpdateIssueNotFound(UpdateIssueStatusUseCase.IssueNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(UnassignIssueUseCase.IssueNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUnassignIssueNotFound(UnassignIssueUseCase.IssueNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(ex.getMessage()));
    }
}
