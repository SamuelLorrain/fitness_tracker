from typing import Generator, Optional, Protocol, TypeAlias
from uuid import UUID

from fitness.food.domain.entities import Food
from fitness.food.domain.value_objects import FoodVA

FoodUserUUID: TypeAlias = UUID

FoodUUID: TypeAlias = UUID

class FoodRepository(Protocol):
    def iter_food(self, user_uuid: FoodUserUUID, filter: Optional[str]) -> Generator[Food, None, None]:
        ... # pragma: no cover

    def store_food(self, user_uuid: FoodUserUUID, food_va: FoodVA) -> FoodUUID:
        ... # pragma: no cover

    def get_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> Optional[Food]:
        ... # pragma: no cover

    def delete_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> None:
        ... # pragma: no cover

    def get_food_by_barcode(self, user_uuid: FoodUserUUID, barcode_value: str) -> Food:
        ... # pragma: no cover
