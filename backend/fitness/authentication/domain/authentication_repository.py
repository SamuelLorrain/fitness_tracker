from typing import Optional, Protocol

from pydantic import EmailStr

from fitness.authentication.domain.entities import User


class AuthenticationRepository(Protocol):
    def get_user_by_email(
        self, email: EmailStr
    ) -> Optional[User]: ...  # pragma: no cover

    def store_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> User: ...  # pragma: no cover
