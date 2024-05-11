from uuid import UUID
from fitness.authentication.domain.entities import Permission
from pydantic import BaseModel, EmailStr, Field, SecretStr


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    password: SecretStr = Field(max_length=1024)


class AuthenticationResponse(BaseModel):
    token_type: str = Field(default="bearer")
    access_token: str


class PermissionRequest(BaseModel):
    user_uuid: UUID
    permissions: list[Permission]
