from uuid import UUID
from fitness.food.domain.value_objects import Grams, KCal, ServingSize
from pydantic import BaseModel


class WaterPayload(BaseModel):
    grams: Grams


class KcalPayload(BaseModel):
    kcal: KCal


class FoodPayload(BaseModel):
    food_uuid: UUID
    serving_size: ServingSize


EntryPayload = WaterPayload | KcalPayload | FoodPayload


