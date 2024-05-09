from dataclasses import dataclass, field
from typing import Optional
from uuid import uuid4

from pydantic import EmailStr

from fitness.authentication.domain.authentication_repository import (
    AuthenticationRepository,
)
from fitness.authentication.domain.entities import Auth
from fitness.authentication.exceptions import UserAlreadyExistsException
from fitness.user.domain.entities import User


@dataclass
class AuthAndUser:
    auth: Auth
    user: User


@dataclass
class InMemoryAuthenticationRepository(AuthenticationRepository):
    data: dict[EmailStr, AuthAndUser] = field(default_factory=dict)

    def get_auth_by_email(self, email: EmailStr) -> Optional[Auth]:
        auth_and_user = self.data.get(email)
        if auth_and_user is None:
            return None
        return auth_and_user.auth

    def store_auth_and_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> Auth:
        existing_user = self.data.get(email)
        if existing_user is not None:
            raise UserAlreadyExistsException
        user = User(
            uuid=uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=email,
            nutrition_goals_per_day=None
        )
        auth = Auth(
            user_uuid=user.uuid,
            email=email,
            hashed_password=hashed_password,
        )
        self.data[email] = AuthAndUser(auth, user)
        return auth
