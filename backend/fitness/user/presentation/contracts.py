from typing import Optional

from pydantic import BaseModel, EmailStr

from fitness.food.domain.value_objects import NutritionComposition


class UserResponse(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    nutrition_goals_per_day: Optional[NutritionComposition]
    notification_enabled: bool = False
    notification_delta_hours: Optional[int]


class UserGoalsRequest(BaseModel):
    nutrition_goals_per_day: Optional[NutritionComposition]


class UserBasicInfosRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class UserWaterNotificationSettingsRequest(BaseModel):
    notification_enabled: bool
    notification_delta_hours: int
