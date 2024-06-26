from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import SecretStr

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.entities import AuthPassKey, Permission

from .contracts import AuthenticationResponse, PermissionRequest, RegisterRequest

auth_router = APIRouter(prefix="/auth", tags=["authentication"])
auth_dep = AuthenticationConfiguration().authorisation_dependency
auth_permission_dep = (
    AuthenticationConfiguration().authorisation_permission_dependency_creator
)


@auth_router.post("/login")
def login(
    login_request: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> AuthenticationResponse:
    configuration = AuthenticationConfiguration()
    auth_service: AuthService = configuration.auth_service
    jwt_formatter: AuthFormatter = configuration.auth_formatter
    pass_key = auth_service.login(
        # oauth_scheme.username is treated as email in the auth_service
        login_request.username,
        SecretStr(login_request.password),
    )
    token = jwt_formatter.serialize(pass_key)
    return AuthenticationResponse(access_token=token)


@auth_router.post("/register")
def register(register_request: RegisterRequest) -> AuthenticationResponse:
    configuration = AuthenticationConfiguration()
    auth_service: AuthService = configuration.auth_service
    jwt_formatter: AuthFormatter = configuration.auth_formatter
    pass_key = auth_service.register(
        register_request.first_name,
        register_request.last_name,
        register_request.email,
        register_request.password,
    )
    token = jwt_formatter.serialize(pass_key)

    return AuthenticationResponse(access_token=token)


@auth_router.get("/verify", status_code=status.HTTP_204_NO_CONTENT)
def verify(_: Annotated[AuthPassKey, Depends(auth_dep)]) -> None:
    """
    The route delegate token verification
    to auth dependency. If the token
    is not valid, the route will
    throw an unauthorized response
    """
    ...


@auth_router.post("/permissions", status_code=status.HTTP_204_NO_CONTENT)
def set_permissions(
    permission_request: PermissionRequest,
    auth_pass_key: Annotated[
        AuthPassKey, Depends(auth_permission_dep(Permission.change_permissions))
    ],
) -> None:
    configuration = AuthenticationConfiguration()
    auth_service: AuthService = configuration.auth_service
    auth_service.set_permissions(auth_pass_key, permission_request.permissions)
