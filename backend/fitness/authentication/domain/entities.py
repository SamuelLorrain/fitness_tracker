from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class Permission(str, Enum):
    change_permissions = "change_permissions"
    create_global_food = "create_global_food"
    send_notification_to_any_user = "send_notification_to_any_user"
    schedule_notifications = "schedule_notifications"


class Auth(BaseModel):
    user_uuid: UUID
    email: EmailStr
    hashed_password: bytes
    permissions: list[Permission] = Field(default_factory=lambda: [])


class AuthPassKey(BaseModel):
    uuid: UUID
    email: EmailStr
    expiration: datetime
    permissions: list[Permission] = Field(default_factory=lambda: [])
