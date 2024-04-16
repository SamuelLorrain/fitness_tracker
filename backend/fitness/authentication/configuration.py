from dataclasses import dataclass
from datetime import timedelta

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.user_repository import UserRepository
from fitness.authentication.infra.jwt_auth_formatter import JwtAuthFormatter
from fitness.authentication.infra.mongodb_user_repository import MongoDBUserRepository


@dataclass
class AuthenticationConfiguration:
    @property
    def auth_service(self) -> AuthService:
        return AuthService(self.user_repository, self.expiration_timedelta)

    @property
    def user_repository(self) -> UserRepository:
        return MongoDBUserRepository()

    @property
    def auth_formatter(self) -> AuthFormatter:
        return JwtAuthFormatter()

    @property
    def expiration_timedelta(self) -> timedelta:
        return timedelta(hours=24)
