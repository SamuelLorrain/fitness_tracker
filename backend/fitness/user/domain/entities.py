from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr

from fitness.food.domain.value_objects import NutritionComposition


class User(BaseModel):
    uuid: UUID
    first_name: str
    last_name: str
    email: EmailStr
    nutrition_goals_per_day: Optional[NutritionComposition]
    notification_enabled: bool = False
    notification_delta_hours: Optional[int]
