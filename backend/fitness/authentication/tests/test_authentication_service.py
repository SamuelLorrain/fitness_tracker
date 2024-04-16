from datetime import timedelta

import pytest
from pydantic import SecretStr
from pytest import fixture

from fitness.authentication.domain.auth_service import AuthService
from fitness.authentication.domain.user_repository import UserRepository
from fitness.authentication.exceptions import (
    BadPasswordException,
    UnknownUserException,
    UserAlreadyExistsException,
)
from fitness.authentication.infra.in_memory_user_repository import (
    InMemoryUserRepository,
)


@fixture
def user_repository() -> UserRepository:
    return InMemoryUserRepository()


@fixture
def auth_service(user_repository: UserRepository) -> AuthService:
    return AuthService(user_repository, timedelta(hours=24))


def test_login_with_good_credential(auth_service: AuthService) -> None:
    email = "email@email.com"
    auth_service.register("f", "l", email, SecretStr("password"))
    pass_key = auth_service.login(email, SecretStr("password"))
    assert pass_key.email == email


def test_login_with_bad_credential(auth_service: AuthService) -> None:
    email = "email@email.com"
    auth_service.register("f", "l", email, SecretStr("password"))
    with pytest.raises(BadPasswordException):
        auth_service.login(email, SecretStr("bad_password"))
    with pytest.raises(UnknownUserException):
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
