from typing import Annotated, Optional, Protocol

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.entities import AuthPassKey, Permission
from fitness.authentication.exceptions import (
    UnableToLoginException,
    UnauthorizedException,
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class AuthorisationDependency(Protocol):
    def __call__(self, token: Annotated[Optional[str], Depends(oauth2_scheme)] = None) -> Optional[AuthPassKey]:
        ...


class SimpleAuthorisationDependency(AuthorisationDependency):
    """
    The role of the authorisation dependency is
    to inject the current user into
    the request as a usable AuthPassKey
    """

    def __init__(self, auth_formatter: AuthFormatter, auth_service: AuthService):
        self.jwt_auth_formatter: AuthFormatter = auth_formatter
        self.auth_service: AuthService = auth_service

    def __call__(
        self, token: Annotated[Optional[str], Depends(oauth2_scheme)] = None
    ) -> Optional[AuthPassKey]:
        self.token = token
        if self.token is None:
            return None
        auth_pass_key = self.jwt_auth_formatter.deserialize(self.token)
        if self.auth_service.verify(auth_pass_key):
            return auth_pass_key
        raise UnableToLoginException


class AuthorisationPermissionDependency(AuthorisationDependency):
    def __init__(self, auth_formatter: AuthFormatter, auth_service: AuthService):
        self.jwt_auth_formatter: AuthFormatter = auth_formatter
        self.auth_service: AuthService = auth_service
        self.permission_setted = False

    def _set_needed_permission(self, permission: Permission) -> None:
        self.permission_setted = True
        self.permission = permission

    def _check_permissions(self, auth_pass_key: AuthPassKey) -> bool:
        if self.permission_setted is False:
            raise Exception("Authorisation have not been setted up properly")
        else:
            return self.permission in auth_pass_key.permissions

    def __call__(
        self, token: Annotated[Optional[str], Depends(oauth2_scheme)] = None
    ) -> Optional[AuthPassKey]:
        self.token = token
        if self.token is None:
            return None
        auth_pass_key = self.jwt_auth_formatter.deserialize(self.token)
        if not self._check_permissions(auth_pass_key):
            raise UnauthorizedException
        if self.auth_service.verify(auth_pass_key):
            return auth_pass_key
        raise UnableToLoginException


class AuthorisationPermissionDependencyCreator:
    def __init__(self, auth_formatter: AuthFormatter, auth_service: AuthService):
        self.jwt_auth_formatter: AuthFormatter = auth_formatter
        self.auth_service: AuthService = auth_service

    def __call__(self, permission: Permission) -> AuthorisationPermissionDependency:
        dep = AuthorisationPermissionDependency(self.jwt_auth_formatter, self.auth_service)
        dep._set_needed_permission(permission)
        return dep

