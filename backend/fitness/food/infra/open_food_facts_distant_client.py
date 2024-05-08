from dataclasses import dataclass, field
from json import JSONDecodeError
from typing import Optional
from fitness.food.infra.barcode_client_settings import BarcodeClientSettings
from fitness.food.domain.food_distant_client import FoodDistant, FoodDistantClient
import requests


@dataclass
class OpenFoodFactsDistantClient(FoodDistantClient):
    settings: BarcodeClientSettings = field(default_factory=lambda:BarcodeClientSettings())

    def fetch_food_by_barcode(self, barcode_value: str) -> Optional[FoodDistant]:
        response = requests.get(self._create_uri(barcode_value))
        if response.status_code != 200:
            return None
        try:
            data: dict = response.json()
        except JSONDecodeError:
            return None
        if data["status"] == 0 or data["status_verbose"] == 'no code or invalid code':
            return None
        return FoodDistant(**data)

    def _create_uri(self, barcode_value):
        uri = self.settings.OPEN_FOOD_FACTS.DOMAIN
        uri += self.settings.OPEN_FOOD_FACTS.PRODUCT_API_PATH
        uri += barcode_value
        uri += self.settings.OPEN_FOOD_FACTS.FORMAT
        return uri
