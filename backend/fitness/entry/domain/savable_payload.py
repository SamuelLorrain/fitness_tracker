from fitness.food.domain.value_objects import Grams, KCal, NutritionComposition
from pydantic import BaseModel

class WaterSavablePayload(BaseModel):
    grams: Grams


class KCalSavablePayload(BaseModel):
    kcal: KCal


FoodSavablePayload = NutritionComposition


SavablePayload = WaterSavablePayload | KCalSavablePayload | FoodSavablePayload


