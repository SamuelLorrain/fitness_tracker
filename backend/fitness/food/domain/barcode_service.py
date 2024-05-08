from dataclasses import dataclass
from typing import Optional
from fitness.authentication.domain.entities import AuthPassKey
from fitness.food.domain.entities import Food
from fitness.food.domain.food_distant_client import FoodDistant, FoodDistantClient
from fitness.food.domain.food_repository import FoodRepository
from fitness.food.exceptions import FoodDoesNotExistsException


@dataclass
class BarcodeService:
    food_repository: FoodRepository
    food_distant_client: FoodDistantClient

    def try_get_food_by_barcode(self, pass_key: AuthPassKey, barcode_value: str) -> Optional[Food|FoodDistant]:
        try:
            return self.food_repository.get_food_by_barcode(pass_key.uuid, barcode_value)
        except FoodDoesNotExistsException:
            return self._get_food_from_distant(barcode_value)

    def _get_food_from_distant(self, barcode_value: str) -> Optional[FoodDistant]:
        food_distant = self.food_distant_client.fetch_food_by_barcode(barcode_value)
        if food_distant is None:
            return None
        return food_distant
