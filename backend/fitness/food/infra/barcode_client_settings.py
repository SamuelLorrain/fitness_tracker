from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class OpenFoodFactInformations(BaseModel):
    DOMAIN: str = 'https://world.openfoodfacts.org'
    PRODUCT_API_PATH: str = '/api/v0/product/'
    FORMAT: str = 'json'


class BarcodeClientSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=None)

    OPEN_FOOD_FACTS: OpenFoodFactInformations = Field(default_factory=lambda:OpenFoodFactInformations())
