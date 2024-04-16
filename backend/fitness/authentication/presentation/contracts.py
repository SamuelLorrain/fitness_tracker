from pydantic import BaseModel, EmailStr, Field, SecretStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: SecretStr


class RegisterRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    password: SecretStr = Field(max_length=1024)


class AuthenticationResponse(BaseModel):
    email: EmailStr
    token: str
