from typing import Protocol

from fitness.authentication.domain.value_objects import AuthPassKey


class AuthFormatter(Protocol):
    def serialize(self, auth_pass_key: AuthPassKey) -> str: ...  # pragma: no cover
