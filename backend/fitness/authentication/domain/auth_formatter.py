from typing import Protocol

from fitness.authentication.domain.entities import AuthPassKey


class AuthFormatter(Protocol):
    def serialize(self, auth_pass_key: AuthPassKey) -> str: ...  # pragma: no cover

    def deserialize(self, token: str) -> AuthPassKey: ...
