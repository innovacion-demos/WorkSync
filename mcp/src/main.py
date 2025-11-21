"""
WorkSync MCP Server - Thin orchestration layer using FastMCP

Clean Architecture:
- main.py: Tool definitions and orchestration (this file)
- client.py: HTTP client logic
- prompts.py: Tool descriptions
"""

from typing import Dict, Any, List, Optional

from fastmcp import FastMCP
from .client import WorkSyncClient
from . import prompts

# Initialize FastMCP and client
mcp = FastMCP(name="WorkSync")
client = WorkSyncClient()


@mcp.tool()
async def create_issue(title: str, description: str) -> Dict[str, Any]:
    """
    Create a new issue in the WorkSync system.

    Returns human-readable information about the created issue that anyone can understand,
    including the issue ID, title, status, and when it was created.
    """
    return await client.create_issue(title, description)


@mcp.tool()
async def list_issues() -> List[Dict[str, Any]]:
    """
    List all issues in the system.

    Returns simplified, human-readable information about all issues that anyone can understand,
    including titles, statuses, who they're assigned to, and basic details.
    """
    return await client.list_issues()


@mcp.tool()
async def get_issue(issue_id: int) -> Dict[str, Any]:
    """
    Get details of a specific issue by ID.

    Returns easy-to-understand information about the issue, such as its title,
    description, current status, who's working on it, and relevant dates.
    """
    return await client.get_issue(issue_id)


@mcp.tool()
async def assign_issue(issue_id: int, user_id: int) -> Dict[str, Any]:
    """
    Assign an issue to a user (automatically changes status to IN_PROGRESS).

    Returns plain-language confirmation showing the issue was assigned, who it's assigned to,
    and the updated status - no technical jargon.
    """
    return await client.assign_issue(issue_id, user_id)


@mcp.tool()
async def unassign_issue(issue_id: int, user_id: int = 0) -> Dict[str, Any]:
    """
    Unassign an issue (reverts status to OPEN).

    Returns simple, clear information confirming the issue is no longer assigned
    and is now available for anyone to take.
    """
    return await client.unassign_issue(issue_id, user_id)


@mcp.tool()
async def update_issue_status(issue_id: int, status: str, user_id: int) -> Dict[str, Any]:
    """
    Update issue status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED).

    Returns friendly, understandable information about the issue's new status
    and what that means in plain terms.
    """
    return await client.update_issue_status(issue_id, status, user_id)


@mcp.tool()
async def create_user(username: str, password: str, name: str, email: str) -> Dict[str, Any]:
    """
    Create a new user in the system.

    Returns straightforward information about the newly created user,
    including their ID, name, and contact details in an easy-to-read format.
    """
    return await client.create_user(username, password, name, email)


@mcp.tool()
async def list_users(department: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    List all users, optionally filtered by department.

    Returns a simple, readable list of users with their basic information
    like names, departments, and contact details that anyone can understand.
    """
    return await client.list_users(department)


@mcp.tool()
async def get_user(user_id: int) -> Dict[str, Any]:
    """
    Get details of a specific user by ID.

    Returns clear, human-friendly information about the user including
    their name, contact details, and department in plain language.
    """
    return await client.get_user(user_id)


@mcp.tool()
async def update_user(
    user_id: int,
    name: Optional[str] = None,
    email: Optional[str] = None,
    phone: Optional[str] = None,
    address: Optional[str] = None,
    department: Optional[str] = None
) -> Dict[str, Any]:
    """
    Update a user's profile information.

    Returns easy-to-understand confirmation of what was updated,
    showing the user's new information in a friendly, readable format.
    """
    return await client.update_user(user_id, name, email, phone, address, department)


@mcp.tool()
async def delete_user(user_id: int) -> Dict[str, str]:
    """
    Delete a user from the system.

    Returns a simple confirmation message that the user was removed,
    expressed in clear, everyday language.
    """
    await client.delete_user(user_id)
    return {"message": f"User {user_id} deleted successfully"}


if __name__ == "__main__":
    mcp.run(transport="streamable-http", host="127.0.0.1", port=9000)
