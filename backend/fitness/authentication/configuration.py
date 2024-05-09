from dataclasses import dataclass
from datetime import timedelta

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.authentication_repository import (
    AuthenticationRepository,
)
from fitness.authentication.infra.jwt_auth_formatter import JwtAuthFormatter
from fitness.authentication.infra.mongodb_authentication_repository import (
    MongoDBAuthenticationRepository,
)
from fitness.authentication.presentation.dependency import AuthorisationDependency
from fitness.commons.singleton import Singleton


@dataclass
class AuthenticationConfiguration(Singleton):
    @property
    def auth_service(self) -> AuthService:
        return AuthService(self.authentication_repository, self.expiration_timedelta)

    @property
    def authentication_repository(self) -> AuthenticationRepository:
        return MongoDBAuthenticationRepository()

    @property
    def auth_formatter(self) -> AuthFormatter:
        return JwtAuthFormatter()

    @property
    def expiration_timedelta(self) -> timedelta:
        return timedelta(hours=24)

    @property
    def authorisation_dependency(self) -> AuthorisationDependency:
        return AuthorisationDependency(self.auth_formatter, self.auth_service)
