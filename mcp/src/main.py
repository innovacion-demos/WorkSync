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
    """Create a new issue in the WorkSync system"""
    return await client.create_issue(title, description)


@mcp.tool()
async def list_issues() -> List[Dict[str, Any]]:
    """List all issues in the system"""
    return await client.list_issues()


@mcp.tool()
async def get_issue(issue_id: int) -> Dict[str, Any]:
    """Get details of a specific issue by ID"""
    return await client.get_issue(issue_id)


@mcp.tool()
async def assign_issue(issue_id: int, user_id: int) -> Dict[str, Any]:
    """Assign an issue to a user (automatically changes status to IN_PROGRESS)"""
    return await client.assign_issue(issue_id, user_id)


@mcp.tool()
async def unassign_issue(issue_id: int, user_id: int = 0) -> Dict[str, Any]:
    """Unassign an issue (reverts status to OPEN)"""
    return await client.unassign_issue(issue_id, user_id)


@mcp.tool()
async def update_issue_status(issue_id: int, status: str, user_id: int) -> Dict[str, Any]:
    """Update issue status (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED)"""
    return await client.update_issue_status(issue_id, status, user_id)


@mcp.tool()
async def create_user(username: str, password: str, name: str, email: str) -> Dict[str, Any]:
    """Create a new user in the system"""
    return await client.create_user(username, password, name, email)


@mcp.tool()
async def list_users(department: Optional[str] = None) -> List[Dict[str, Any]]:
    """List all users, optionally filtered by department"""
    return await client.list_users(department)


@mcp.tool()
async def get_user(user_id: int) -> Dict[str, Any]:
    """Get details of a specific user by ID"""
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
    """Update a user's profile information"""
    return await client.update_user(user_id, name, email, phone, address, department)


@mcp.tool()
async def delete_user(user_id: int) -> Dict[str, str]:
    """Delete a user from the system"""
    await client.delete_user(user_id)
    return {"message": f"User {user_id} deleted successfully"}


if __name__ == "__main__":
    # Run as SSE server on port 9001
    mcp.run(transport="sse", host="127.0.0.1", port=9001)
