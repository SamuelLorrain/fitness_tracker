from uuid import UUID

from pydantic import BaseModel

from fitness.notification.domain.value_objects import Token


class TokenRequest(BaseModel):
    token: Token


class NotificationRequest(BaseModel):
    user_uuid: UUID
    title: str
    text: str
