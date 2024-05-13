from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from pydantic import EmailStr

from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.food.domain.value_objects import NutritionComposition
from fitness.user.domain.entities import User
from fitness.user.domain.user_repository import UserRepository


@dataclass
class UserService:
    user_repository: UserRepository

    def get_user(self, user_uuid: UUID) -> User:
        db_user = self.user_repository.get_user(user_uuid)
        if db_user is None:
            raise EntityDoesNotExistsException
        return db_user

    def set_nutrition_goals_for_user(
        self, user_uuid: UUID, nutrition_goals_per_day: Optional[NutritionComposition]
    ) -> None:
        db_user = self.user_repository.get_user(user_uuid)
        if db_user is None:
            raise EntityDoesNotExistsException
        db_user.nutrition_goals_per_day = nutrition_goals_per_day
        validated_user = User(**db_user.model_dump())
        self.user_repository.set_user(user_uuid, validated_user)

    def set_user_basic_infos(
        self, user_uuid: UUID, first_name: str, last_name: str, email: EmailStr
    ) -> None:
        db_user = self.user_repository.get_user(user_uuid)
        if db_user is None:
            raise EntityDoesNotExistsException
        db_user.first_name = first_name
        db_user.last_name = last_name
        db_user.email = email
        validated_user = User(**db_user.model_dump())
        self.user_repository.set_user(user_uuid, validated_user)

    def set_water_notification_settings(
        self, user_uuid: UUID, notification_enabled: bool, notification_delta_hours: int
    ) -> None:
        db_user = self.user_repository.get_user(user_uuid)
        if db_user is None:
            raise EntityDoesNotExistsException
        db_user.notification_enabled = notification_enabled
        db_user.notification_delta_hours = notification_delta_hours
        validated_user = User(**db_user.model_dump())
        self.user_repository.set_user(user_uuid, validated_user)
