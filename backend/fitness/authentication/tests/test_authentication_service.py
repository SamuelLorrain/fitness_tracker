from datetime import timedelta

import pytest
from pydantic import SecretStr
from pytest import fixture

from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.authentication_repository import AuthenticationRepository
from fitness.authentication.exceptions import (
    UnableToLoginException,
    UserAlreadyExistsException,
)
from fitness.authentication.infra.in_memory_authentication_repository import (
    InMemoryAuthenticationRepository,
)


@fixture
def authentication_repository() -> AuthenticationRepository:
    return InMemoryAuthenticationRepository()


@fixture
def auth_service(authentication_repository: AuthenticationRepository) -> AuthService:
    return AuthService(authentication_repository, timedelta(hours=24))


def test_login_with_good_credential(auth_service: AuthService) -> None:
    email = "email@email.com"
    auth_service.register("f", "l", email, SecretStr("password"))
    pass_key = auth_service.login(email, SecretStr("password"))
    assert pass_key.email == email


def test_login_with_bad_credential(auth_service: AuthService) -> None:
    email = "email@email.com"
    auth_service.register("f", "l", email, SecretStr("password"))
    with pytest.raises(UnableToLoginException):
        auth_service.login(email, SecretStr("bad_password"))
    with pytest.raises(UnableToLoginException):
        auth_service.login("bad@email.com", SecretStr("password"))


def test_register_successfully(auth_service: AuthService) -> None:
    email = "email@email.com"
    pass_key = auth_service.register("f", "l", email, SecretStr("password"))
    assert pass_key.email == email


def test_register_user_already_exists_error(auth_service: AuthService) -> None:
    email = "email@email.com"
    auth_service.register("f", "l", email, SecretStr("password"))
    with pytest.raises(UserAlreadyExistsException):
        auth_service.register("f", "l", email, SecretStr("password"))
