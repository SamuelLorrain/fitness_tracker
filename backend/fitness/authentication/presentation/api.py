from fastapi import APIRouter

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.auth_service import AuthService

from .contracts import AuthenticationResponse, LoginRequest, RegisterRequest

auth_router = APIRouter(prefix="/auth")


@auth_router.post("/login")
def login(login_request: LoginRequest) -> AuthenticationResponse:
    configuration = AuthenticationConfiguration()
    auth_service: AuthService = configuration.auth_service
    jwt_formatter: AuthFormatter = configuration.auth_formatter
    pass_key = auth_service.login(
        login_request.email,
        login_request.password,
    )
    token = jwt_formatter.serialize(pass_key)
    return AuthenticationResponse(email=pass_key.email, token=token)


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

    return AuthenticationResponse(email=pass_key.email, token=token)
