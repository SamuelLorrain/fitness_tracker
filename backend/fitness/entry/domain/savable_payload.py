from uuid import UUID

from pydantic import BaseModel

from fitness.food.domain.value_objects import (
    Grams,
    KCal,
    KiloGrams,
    NutritionComposition,
)


class WaterSavablePayload(BaseModel):
    grams: Grams


class KCalSavablePayload(BaseModel):
    kcal: KCal


class WeightSavablePayload(BaseModel):
    kilo_grams: KiloGrams


class FoodSavablePayload(BaseModel):
    base_food_uuid: UUID
    food_name: str
    nutrition: NutritionComposition


SavablePayload = (
    WaterSavablePayload | KCalSavablePayload | FoodSavablePayload | WeightSavablePayload
)
