from dataclasses import dataclass
from typing import Optional
from uuid import UUID

from fitness.authentication.domain.entities import AuthPassKey
from fitness.food.domain.entities import Food
from fitness.food.domain.food_repository import FoodRepository, FoodUUID
from fitness.food.domain.value_objects import FoodVA, OptionalFoodVA
from fitness.food.exceptions import FoodDoesNotExistsException


@dataclass
class FoodCrudService:
    food_repository: FoodRepository

    # TODO return frozen Food object instead of entity ?
    def list_food(self, pass_key: AuthPassKey, filter: Optional[str]) -> list[Food]:
        return list(self.food_repository.iter_food(pass_key.uuid, filter))

    def store_food(self, pass_key: AuthPassKey, food_va: FoodVA) -> FoodUUID:
        return self.food_repository.store_food(
            pass_key.uuid,
            food_va
        )

    # TODO return frozen Food object instead of entity ?
    def get_food(self, pass_key: AuthPassKey, food_uuid: UUID) -> Food:
        food = self.food_repository.get_food(
            pass_key.uuid,
            food_uuid
        )
        if food is None:
            raise FoodDoesNotExistsException
        return food

    def delete_food(self, pass_key: AuthPassKey, food_uuid: UUID) -> None:
        self.food_repository.delete_food(
            pass_key.uuid,
            food_uuid
        )

    # def patch_food(
    #     self,
    #     pass_key: AuthPassKey,
    #     food_uuid: UUID,
    #     optional_food_va: OptionalFoodVA
    # ) -> None:
    #     food = self.food_repository.get_food(pass_key.uuid, food_uuid)
    #     if food is None:
    #         raise FoodDoesNotExistsException
    #     # TODO to implement for real
