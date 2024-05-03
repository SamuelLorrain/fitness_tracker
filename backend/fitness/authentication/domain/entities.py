from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr

class Auth(BaseModel):
    user_uuid: UUID
    email: EmailStr
    hashed_password: bytes

class AuthPassKey(BaseModel):
    uuid: UUID
    email: EmailStr
    expiration: datetime
