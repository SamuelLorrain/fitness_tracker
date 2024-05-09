from uuid import UUID

from pydantic import BaseModel

from fitness.food.domain.value_objects import Grams, KCal, NutritionComposition


class WaterPayload(BaseModel):
    grams: Grams


class KcalPayload(BaseModel):
    kcal: KCal


class FoodPayload(BaseModel):
    food_name: str
    base_food_uuid: UUID
    nutrition: NutritionComposition


EntryPayload = WaterPayload | KcalPayload | FoodPayload


