from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Optional

import jwt

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.entities import AuthPassKey, Permission
from fitness.authentication.exceptions import UnauthorizedException
from fitness.commons.settings import Settings


@dataclass
class Claims:
    sub: str
    name: str
    uid: str
    exp: int
    scopes: Optional[str] = field(default=None)


@dataclass
class JwtAuthFormatter(AuthFormatter):
    def serialize(self, auth_pass_key: AuthPassKey) -> str:
        claim = Claims(
            sub="auth_token",
            uid=str(auth_pass_key.uuid),
            name=auth_pass_key.email,
            exp=int(auth_pass_key.expiration.timestamp()),
            scopes=" ".join(
                [permission.value for permission in auth_pass_key.permissions]
            ),
        )

        # TODO settings should use a configuration class
        # instead of being direct, As well as for the algorithm
        return jwt.encode(asdict(claim), Settings().JWT_SECRET, algorithm="HS512")

    def deserialize(self, token: str) -> AuthPassKey:
        # TODO same as above
        # TODO if the token can't be decoded as claims,
        # we should have a proper error and not a 500
        claims: Claims = Claims(
            **jwt.decode(token, Settings().JWT_SECRET, algorithms=["HS512"])
        )
        if claims.scopes == "":
            permissions = []
        elif claims.scopes is not None:
            try:
                permissions = [
                    Permission(permission) for permission in claims.scopes.split(" ")
                ]
            except ValueError:  # raised when a permission is not valid
                raise UnauthorizedException
        else:
            permissions = []
        return AuthPassKey(
            uuid=claims.uid,
            email=claims.name,
            expiration=datetime.fromtimestamp(claims.exp),
            permissions=permissions,
        )
