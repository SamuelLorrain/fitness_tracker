from datetime import datetime

from pydantic import BaseModel, EmailStr


class AuthPassKey(BaseModel):
    email: EmailStr
    expiration: datetime
