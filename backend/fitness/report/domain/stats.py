from datetime import date
from typing import Optional, OrderedDict

from pydantic import BaseModel, Field


class NutritionCompositionBasic(BaseModel):
    calories_in_kcal: float
    proteins_in_grams: float
    lipids_in_grams: float
    carbs_in_grams: float
    water_in_grams: float


class Stats(BaseModel):
    fields_per_day: OrderedDict[date, Optional[NutritionCompositionBasic]] = Field(
        default_factory=lambda: OrderedDict()
    )
