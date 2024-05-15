from uuid import UUID

from pydantic import BaseModel

from fitness.food.domain.value_objects import (
    Grams,
    KCal,
    KiloGrams,
    NutritionComposition,
)


class WaterPayload(BaseModel):
    grams: Grams


class KcalPayload(BaseModel):
    kcal: KCal


class WeightPayload(BaseModel):
    kilo_grams: KiloGrams


class FoodPayload(BaseModel):
    food_name: str
    base_food_uuid: UUID
    nutrition: NutritionComposition


EntryPayload = WaterPayload | KcalPayload | FoodPayload | WeightPayload
