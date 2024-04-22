from dataclasses import asdict, dataclass
import jwt

from fitness.authentication.domain.auth_formatter import AuthFormatter
from fitness.authentication.domain.entities import AuthPassKey
from fitness.commons.settings import Settings
from datetime import datetime


@dataclass
class Claims:
    sub: str
    name: str
    uid: str
    exp: int


@dataclass
class JwtAuthFormatter(AuthFormatter):
    def serialize(self, auth_pass_key: AuthPassKey) -> str:
        claim = Claims(
            sub="auth_token",
            uid=str(auth_pass_key.uuid),
            name=auth_pass_key.email,
            exp=int(auth_pass_key.expiration.timestamp()),
        )

        # TODO settings should use a configuration class
        # instead of being direct, As well as for the algorithm
        return jwt.encode(asdict(claim), Settings().JWT_SECRET, algorithm="HS512")

    def deserialize(self, token: str) -> AuthPassKey:
        # TODO same as above
        # TODO if the token can't be decoded as claims,
        # we should have a proper error and not a 500
        claims: Claims = Claims(**jwt.decode(token, Settings().JWT_SECRET, algorithms=["HS512"]))
        return AuthPassKey(
            uuid=claims.uid,
            email=claims.name,
            expiration=datetime.fromtimestamp(claims.exp)
        )
