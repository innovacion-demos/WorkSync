"""
Tool Prompts and Descriptions - Clean separation of documentation
"""

CREATE_ISSUE = """
Create a new issue in the WorkSync system.

Args:
    title: Issue title (required)
    description: Issue description (required)

Returns:
    Created issue with status OPEN and assigned ID

Example:
    title: "Fix login bug"
    description: "Users cannot login with special characters"
"""

LIST_ISSUES = """
List all issues in the system.

Returns:
    List of all issues with their details including:
    - ID, title, description
    - Status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)
    - Assigned user information
    - Created and updated timestamps
"""

GET_ISSUE = """
Get details of a specific issue by ID.

Args:
    issue_id: The ID of the issue to retrieve

Returns:
    Complete issue details including title, description, status, assignee, and timestamps
"""

ASSIGN_ISSUE = """
Assign an issue to a user. This automatically changes the issue status to IN_PROGRESS.

Args:
    issue_id: The ID of the issue to assign
    user_id: The ID of the user to assign the issue to

Returns:
    Updated issue with assigned user and IN_PROGRESS status

Business Rule:
    Assigning an issue automatically changes its status to IN_PROGRESS
"""

UNASSIGN_ISSUE = """
Unassign an issue (remove the current assignee). This reverts the status to OPEN.

Args:
    issue_id: The ID of the issue to unassign
    user_id: The ID of the user performing the action (optional, defaults to 0)

Returns:
    Updated issue without assignee and OPEN status

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
    Updated issue with new status

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
    Created user with assigned ID

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
    List of users with their profile information including:
    - ID, username, name
    - Email, phone, address
    - Department
    - Created and updated timestamps

Example:
    department: "Engineering"  # Returns only Engineering users
    department: None           # Returns all users
"""

GET_USER = """
Get details of a specific user by ID.

Args:
    user_id: The ID of the user to retrieve

Returns:
    Complete user profile including name, email, phone, address, and department
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
    Updated user profile

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
    Success confirmation

Warning:
    This operation is permanent and cannot be undone.
"""
