from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from fitness.authentication.domain.authentication_utils import has_permission
from fitness.authentication.domain.entities import AuthPassKey, Permission
from fitness.authentication.exceptions import UnauthorizedException
from fitness.food.domain.entities import Food
from fitness.food.domain.food_repository import FoodRepository, FoodUUID
from fitness.food.domain.value_objects import FoodVA
from fitness.food.exceptions import FoodDoesNotExistsException


@dataclass
class FoodCrudService:
    food_repository: FoodRepository

    # TODO return frozen Food object instead of entity ?
    def list_food(self, pass_key: AuthPassKey, filter: Optional[str]) -> list[Food]:
        return list(self.food_repository.iter_food(pass_key.uuid, filter))

    def store_food(self, pass_key: AuthPassKey, food_va: FoodVA) -> FoodUUID:
        if food_va.all_users is True and not has_permission(
            Permission.create_global_food, pass_key
        ):
            raise UnauthorizedException(message="Not authorized to create global food")
        return self.food_repository.store_food(pass_key.uuid, food_va)

    # TODO return frozen Food object instead of entity ?
    def get_food(self, pass_key: AuthPassKey, food_uuid: UUID) -> Food:
        food = self.food_repository.get_food(pass_key.uuid, food_uuid)
        if food is None:
            raise FoodDoesNotExistsException
        return food

    def delete_food(self, pass_key: AuthPassKey, food_uuid: UUID) -> None:
        self.food_repository.delete_food(pass_key.uuid, food_uuid)
