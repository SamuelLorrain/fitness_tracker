from dataclasses import dataclass, field
from typing import Generator, Optional
from uuid import UUID, uuid4

from fitness.food.domain.entities import Food
from fitness.food.domain.food_repository import FoodRepository, FoodUserUUID, FoodUUID
from fitness.food.domain.value_objects import FoodVA
from fitness.food.exceptions import FoodDoesNotExistsException


@dataclass
class InMemoryFoodRepository(FoodRepository):
    data: dict[tuple[FoodUserUUID, FoodUUID], Food] = field(default_factory=dict)

    def iter_food(self, user_uuid: FoodUserUUID, filter: Optional[str]) -> Generator[Food, None, None]:
        if filter is None:
            return (v for _,v in self.data.items() if v.user_uuid == user_uuid)
        else:
            # TODO algorithms for fuzzy finding
            return (v for _,v in self.data.items() if filter.lower() in v.name.lower() and v.user_uuid == user_uuid)

    def store_food(self, user_uuid: FoodUserUUID, food_va: FoodVA) -> FoodUUID:
        food_uuid = uuid4()
        new_food = Food(
            uuid=food_uuid,
            user_uuid=user_uuid,
            **food_va.model_dump()
        )
        self.data[(user_uuid, food_uuid)] = new_food
        return food_uuid

    def get_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> Optional[Food]:
        return self.data.get((user_uuid, food_uuid))

    def delete_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> None:
        try:
            del self.data[(user_uuid, food_uuid)]
        except KeyError:
            raise FoodDoesNotExistsException

    def get_food_by_barcode(self, user_uuid: UUID, barcode_value: str) -> Food:
        raise FoodDoesNotExistsException
