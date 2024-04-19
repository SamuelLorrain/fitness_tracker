from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr


class User(BaseModel):
    uuid: UUID
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: bytes


class AuthPassKey(BaseModel):
    email: EmailStr
    expiration: datetime
