from pydantic import BaseModel

from fitness.notification.domain.value_objects import Token


class TokenRequest(BaseModel):
    token: Token
