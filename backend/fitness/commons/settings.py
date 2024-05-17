from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv("../.env"))

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=True, extra="ignore"
    )

    ENVIRONMENT: str
    PW_SECRET: bytes
    JWT_SECRET: str
    FRONTEND_DOMAIN: str
    MONGODB_CONNECTION_STRING: str
    FIREBASE_TOKEN_FILE: str
