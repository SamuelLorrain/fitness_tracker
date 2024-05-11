from typing import Optional, Protocol
from uuid import UUID

from pydantic import EmailStr

from fitness.authentication.domain.entities import Auth, Permission


class AuthenticationRepository(Protocol):
    def get_auth_by_email(
        self, email: EmailStr
    ) -> Optional[Auth]: ...  # pragma: no cover

    def store_auth_and_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> Auth: ...  # pragma: no cover

    def set_permissions(self, user_uuid: UUID, permissions: list[Permission]) -> None:
        ... # pragma: no cover
