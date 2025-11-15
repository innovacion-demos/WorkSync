"""
WorkSync HTTP Client - Clean separation of HTTP logic
"""

import os
from typing import Dict, Any, List, Optional

import httpx


class WorkSyncClient:
    """HTTP client for WorkSync backend API"""

    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv("WORKSYNC_API_URL", "http://localhost:8080")

    # ============================================================================
    # ISSUE OPERATIONS
    # ============================================================================

    async def create_issue(self, title: str, description: str) -> Dict[str, Any]:
        """Create a new issue"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.post(
                "/api/issues",
                json={"title": title, "description": description}
            )
            resp.raise_for_status()
            return resp.json()

    async def list_issues(self) -> List[Dict[str, Any]]:
        """List all issues"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.get("/api/issues")
            resp.raise_for_status()
            return resp.json()

    async def get_issue(self, issue_id: int) -> Dict[str, Any]:
        """Get an issue by ID"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.get(f"/api/issues/{issue_id}")
            resp.raise_for_status()
            return resp.json()

    async def assign_issue(self, issue_id: int, user_id: int) -> Dict[str, Any]:
        """Assign an issue to a user"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.put(
                f"/api/issues/{issue_id}/assign",
                json={"userId": user_id}
            )
            resp.raise_for_status()
            return resp.json()

    async def unassign_issue(self, issue_id: int, user_id: int = 0) -> Dict[str, Any]:
        """Unassign an issue"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.put(
                f"/api/issues/{issue_id}/unassign",
                json={"userId": user_id}
            )
            resp.raise_for_status()
            return resp.json()

    async def update_issue_status(
        self,
        issue_id: int,
        status: str,
        user_id: int
    ) -> Dict[str, Any]:
        """Update issue status"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.put(
                f"/api/issues/{issue_id}/status",
                json={"status": status.upper(), "userId": user_id}
            )
            resp.raise_for_status()
            return resp.json()

    # ============================================================================
    # USER OPERATIONS
    # ============================================================================

    async def create_user(
        self,
        username: str,
        password: str,
        name: str,
        email: str
    ) -> Dict[str, Any]:
        """Create a new user"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.post(
                "/api/users",
                json={
                    "username": username,
                    "password": password,
                    "name": name,
                    "email": email
                }
            )
            resp.raise_for_status()
            return resp.json()

    async def list_users(self, department: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all users, optionally filtered by department"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            params = {"department": department} if department else {}
            resp = await client.get("/api/users", params=params)
            resp.raise_for_status()
            return resp.json()

    async def get_user(self, user_id: int) -> Dict[str, Any]:
        """Get a user by ID"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.get(f"/api/users/{user_id}")
            resp.raise_for_status()
            return resp.json()

    async def update_user(
        self,
        user_id: int,
        name: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        address: Optional[str] = None,
        department: Optional[str] = None
    ) -> Dict[str, Any]:
        """Update user profile"""
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if email is not None:
            update_data["email"] = email
        if phone is not None:
            update_data["phone"] = phone
        if address is not None:
            update_data["address"] = address
        if department is not None:
            update_data["department"] = department

        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.put(f"/api/users/{user_id}", json=update_data)
            resp.raise_for_status()
            return resp.json()

    async def delete_user(self, user_id: int) -> None:
        """Delete a user"""
        async with httpx.AsyncClient(base_url=self.base_url, timeout=30.0) as client:
            resp = await client.delete(f"/api/users/{user_id}")
            resp.raise_for_status()
