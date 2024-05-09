from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True, env_file=".env", extra="ignore"
    )

    ENVIRONMENT: str
    PW_SECRET: bytes
    JWT_SECRET: str
    FRONTEND_DOMAIN: str
    MONGODB_CONNECTION_STRING: str
