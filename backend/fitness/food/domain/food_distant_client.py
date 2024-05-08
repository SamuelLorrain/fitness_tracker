from typing import Optional, Protocol
from pydantic import BaseModel, Field


class FoodDistantNutriments(BaseModel):
    carbohydrates_100g: float
    energy_kcal_100g: float = Field(alias="energy-kcal_100g")
    fiber_100g: float
    fat_100g: float
    proteins_100g: float

class FoodDistantProduct(BaseModel):
    nutriments: FoodDistantNutriments
    product_name: str

class FoodDistant(BaseModel):
    """
    We use a openfood fact api json alike format.
    """
    code: str
    product: FoodDistantProduct


class FoodDistantClient(Protocol):
    def fetch_food_by_barcode(self, barcode_value: str) -> Optional[FoodDistant]:
        ... # pragma: no cover

