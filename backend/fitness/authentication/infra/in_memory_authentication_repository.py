from dataclasses import dataclass, field
from typing import Optional
from uuid import uuid4

from pydantic import EmailStr

from fitness.authentication.domain.entities import User
from fitness.authentication.domain.authentication_repository import AuthenticationRepository
from fitness.authentication.exceptions import UserAlreadyExistsException


@dataclass
class InMemoryAuthenticationRepository(AuthenticationRepository):
    data: dict[EmailStr, User] = field(default_factory=dict)

    def get_user_by_email(self, email: EmailStr) -> Optional[User]:
        return self.data.get(email)

    def store_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> User:
        existing_user = self.data.get(email)
        if existing_user is not None:
            raise UserAlreadyExistsException
        user = User(
            uuid=uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
        )
        self.data[email] = user
        return user
