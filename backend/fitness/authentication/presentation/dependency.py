from typing import Annotated, Optional

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.entities import AuthPassKey
from fitness.authentication.exceptions import UnableToLoginException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


class AuthorisationDependency:
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
