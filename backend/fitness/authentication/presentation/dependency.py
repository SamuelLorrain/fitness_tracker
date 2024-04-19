from typing import Annotated, Optional
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends
from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.entities import AuthPassKey

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

class AuthorisationDependency:
    """
    The role of the authorisation dependency is
    to inject the current user into
    the request as a usable AuthPassKey
    """

    def __init__(self, auth_formatter: AuthFormatter):
        self.jwt_auth_formatter: AuthFormatter = auth_formatter

    def __call__(self, token: Annotated[Optional[str], Depends(oauth2_scheme)] = None) -> Optional[AuthPassKey]:
        self.token = token
        if self.token is not None:
            return self.jwt_auth_formatter.deserialize(self.token)
        return None
