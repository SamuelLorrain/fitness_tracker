from dataclasses import asdict, dataclass

import jwt

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.value_objects import AuthPassKey
from fitness.commons.settings import Settings


@dataclass
class Claims:
    sub: str
    name: str
    exp: int


class JwtAuthFormatter(AuthFormatter):
    def serialize(self, auth_pass_key: AuthPassKey) -> str:
        claim = Claims(
            sub="auth_token",
            name=auth_pass_key.email,
            exp=int(auth_pass_key.expiration.timestamp()),
        )

        return jwt.encode(asdict(claim), Settings().JWT_SECRET, algorithm="HS512")
