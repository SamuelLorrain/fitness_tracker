from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from hashlib import scrypt

from pydantic import EmailStr, SecretStr

from fitness.authentication.domain.user_repository import UserRepository
from fitness.authentication.domain.entities import AuthPassKey
from fitness.authentication.exceptions import BadPasswordException, UnableToLoginException, UnknownUserException
from fitness.commons.settings import Settings


@dataclass
class AuthService:
    user_repository: UserRepository
    expiration_timedelta: timedelta

    def login(self, email: EmailStr, password: SecretStr) -> AuthPassKey:
        user = self.user_repository.get_user_by_email(email)
        if user is None:
            raise UnableToLoginException
        hashed_password = self._hash_password(password)
        if user.hashed_password != hashed_password:
            raise UnableToLoginException
        return AuthPassKey(
            uuid=user.uuid, email=user.email, expiration=datetime.now(UTC) + self.expiration_timedelta
        )

    def register(
        self, first_name: str, last_name: str, email: EmailStr, password: SecretStr
    ) -> AuthPassKey:
        hash = self._hash_password(password)
        user = self.user_repository.store_user(first_name, last_name, email, hash)
        return AuthPassKey(
            uuid=user.uuid, email=email, expiration=datetime.now(UTC) + self.expiration_timedelta
        )

    @staticmethod
    def _hash_password(password: SecretStr) -> bytes:
        hash = scrypt(
            password.get_secret_value().encode("utf8"),
            salt=Settings().PW_SECRET,
            n=2,
            r=512,
            p=2,
        )
        return hash
