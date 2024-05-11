from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from hashlib import scrypt

from pydantic import EmailStr, SecretStr

from fitness.authentication.domain.authentication_repository import (
    AuthenticationRepository,
)
from fitness.authentication.domain.entities import AuthPassKey, Permission
from fitness.authentication.exceptions import UnableToLoginException
from fitness.commons.settings import Settings


@dataclass
class AuthService:
    authentication_repository: AuthenticationRepository
    expiration_timedelta: timedelta

    def login(self, email: EmailStr, password: SecretStr) -> AuthPassKey:
        auth = self.authentication_repository.get_auth_by_email(email)
        if auth is None:
            raise UnableToLoginException
        hashed_password = self._hash_password(password)
        if auth.hashed_password != hashed_password:
            raise UnableToLoginException
        return AuthPassKey(
            uuid=auth.user_uuid,
            email=auth.email,
            expiration=datetime.now(UTC) + self.expiration_timedelta,
            permissions=auth.permissions,
        )

    def register(
        self, first_name: str, last_name: str, email: EmailStr, password: SecretStr
    ) -> AuthPassKey:
        hash = self._hash_password(password)
        auth = self.authentication_repository.store_auth_and_user(
            first_name, last_name, email, hash
        )
        return AuthPassKey(
            uuid=auth.user_uuid,
            email=email,
            expiration=datetime.now(UTC) + self.expiration_timedelta,
        )

    def verify(self, auth_pass_key: AuthPassKey) -> bool:
        if auth_pass_key.expiration < datetime.now():
            return False
        auth = self.authentication_repository.get_auth_by_email(auth_pass_key.email)
        return auth is not None

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

    def set_permissions(
        self, auth_pass_key: AuthPassKey, permissions: list[Permission]
    ) -> None:
        self.authentication_repository.set_permissions(auth_pass_key.uuid, permissions)
