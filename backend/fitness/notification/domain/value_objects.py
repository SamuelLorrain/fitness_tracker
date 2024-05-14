from uuid import UUID

from pydantic import BaseModel

Token = str


class NotificationMessage(BaseModel):
    title: str
    text: str


class NotificationReceiver(BaseModel):
    user_uuid: UUID
    token: str
