from uuid import UUID
from fitness.food.domain.value_objects import Grams, KCal, NutritionComposition
from pydantic import BaseModel


class WaterPayload(BaseModel):
    grams: Grams


class KcalPayload(BaseModel):
    kcal: KCal


class FoodPayload(BaseModel):
    food_name: str
    base_food_uuid: UUID
    nutrition: NutritionComposition


EntryPayload = WaterPayload | KcalPayload | FoodPayload


