from uuid import UUID
from fitness.food.domain.value_objects import Grams, KCal, NutritionComposition
from pydantic import BaseModel

class WaterSavablePayload(BaseModel):
    grams: Grams


class KCalSavablePayload(BaseModel):
    kcal: KCal


class FoodSavablePayload(BaseModel):
    base_food_uuid: UUID
    nutrition: NutritionComposition


SavablePayload = WaterSavablePayload | KCalSavablePayload | FoodSavablePayload


