from typing import Optional
from fitness.food.domain.food_distant_client import FoodDistant, FoodDistantClient


class FailDistantClient(FoodDistantClient):
    def fetch_food_by_barcode(self, barcode_value: str) -> Optional[FoodDistant]:
        return None
