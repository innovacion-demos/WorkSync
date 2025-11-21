"""
Tool Prompts and Descriptions - Clean separation of documentation

NOTE: All tools return human-readable, simplified information that anyone can understand.
The responses contain everyday language explanations, not technical details or jargon.
"""

CREATE_ISSUE = """
Create a new issue in the WorkSync system.

Args:
    title: Issue title (required)
    description: Issue description (required)

Returns:
    Human-readable information about the created issue in simple terms,
    including the issue ID, title, status, and when it was created.
    The response uses everyday language that anyone can understand.

Example:
    title: "Fix login bug"
    description: "Users cannot login with special characters"
"""

LIST_ISSUES = """
List all issues in the system.

Returns:
    Simplified, easy-to-read list of all issues with basic information that anyone
    can understand, including titles, statuses (like "Open", "In Progress", etc.),
    who they're assigned to, and when they were created. No technical details.
"""

GET_ISSUE = """
Get details of a specific issue by ID.

Args:
    issue_id: The ID of the issue to retrieve

Returns:
    Clear, human-friendly information about the issue including its title, description,
    current status, who's working on it, and relevant dates. All in plain language
    that anyone can understand without technical knowledge.
"""

ASSIGN_ISSUE = """
Assign an issue to a user. This automatically changes the issue status to IN_PROGRESS.

Args:
    issue_id: The ID of the issue to assign
    user_id: The ID of the user to assign the issue to

Returns:
    Plain-language confirmation showing the issue was assigned, who it's assigned to,
    and the updated status. Presented in simple, everyday terms without technical jargon.

Business Rule:
    Assigning an issue automatically changes its status to IN_PROGRESS
"""

UNASSIGN_ISSUE = """
Unassign an issue (remove the current assignee). This reverts the status to OPEN.

Args:
    issue_id: The ID of the issue to unassign
    user_id: The ID of the user performing the action (optional, defaults to 0)

Returns:
    Simple, clear confirmation that the issue is no longer assigned and is now
    available for anyone to take. Explained in friendly, everyday language.

Business Rule:
    Unassigning an issue automatically reverts its status to OPEN
"""

UPDATE_ISSUE_STATUS = """
Update the status of an issue.

Args:
    issue_id: The ID of the issue
    status: New status - must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    user_id: The ID of the user performing the update

Returns:
    Friendly, understandable information about the issue's new status and what that
    means, expressed in plain terms that anyone can grasp without technical background.

Business Rules:
    - Only IN_PROGRESS issues can be marked as RESOLVED
    - Only RESOLVED issues can be marked as CLOSED
    - Issues can be REJECTED from any status

Status Workflow:
    OPEN → IN_PROGRESS → RESOLVED → CLOSED
      ↓
    REJECTED
"""

CREATE_USER = """
Create a new user in the system.

Args:
    username: Unique username (required)
    password: User password (required)
    name: Full name (required)
    email: Email address (required)

Returns:
    Straightforward information about the newly created user in simple terms,
    including their ID, name, and contact details. Presented in an easy-to-read,
    non-technical format that anyone can understand.

Example:
    username: "johndoe"
    password: "secure123"
    name: "John Doe"
    email: "john@example.com"
"""

LIST_USERS = """
List all users, optionally filtered by department.

Args:
    department: Filter users by department (optional)

Returns:
    A simple, readable list of users with their basic information presented
    in plain language. Includes names, departments, and contact details in a
    format that anyone can easily understand without technical expertise.

Example:
    department: "Engineering"  # Returns only Engineering users
    department: None           # Returns all users
"""

GET_USER = """
Get details of a specific user by ID.

Args:
    user_id: The ID of the user to retrieve

Returns:
    Clear, human-friendly information about the user presented in plain language,
    including their name, contact details, and department. Easy to understand
    without any technical knowledge.
"""

UPDATE_USER = """
Update a user's profile information.

Args:
    user_id: The ID of the user to update (required)
    name: Full name (optional)
    email: Email address (optional)
    phone: Phone number (optional)
    address: Address (optional)
    department: Department (optional)

Returns:
    Easy-to-understand confirmation of what was updated, showing the user's
    new information in a friendly, readable format with plain language that
    anyone can comprehend without technical background.

Note:
    Only provided fields will be updated. Omitted fields remain unchanged.

Example:
    user_id: 1
    phone: "+1-555-0100"
    department: "Engineering"
    # name, email, address remain unchanged
"""

DELETE_USER = """
Delete a user from the system.

Args:
    user_id: The ID of the user to delete

Returns:
    A simple confirmation message that the user was removed,
    expressed in clear, everyday language that anyone can understand.

Warning:
    This operation is permanent and cannot be undone.
"""
