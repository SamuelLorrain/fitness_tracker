from collections.abc import Generator
from typing import Any, Optional
from fitness.commons.connection import MongoDBConnection
from fitness.food.domain.entities import Food
from fitness.food.domain.food_repository import FoodRepository, FoodUUID, FoodUserUUID
from fitness.food.domain.value_objects import FoodVA
from uuid import uuid4

from fitness.food.exceptions import FoodDoesNotExistsException


class MongoDBFoodRepository(FoodRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.food_collection = self.db.food_collection

    def iter_food(self, user_uuid: FoodUserUUID, filter: Optional[str]) -> Generator[Food, None, None]:
        search: dict[str, Any] = { "user_uuid": user_uuid }
        if filter is not None:
            search["name"] = {
                "$regex": filter,
                "$options": "i"
            }
        db_foods = self.food_collection.find(search)
        return (Food(**food) for food in db_foods)

    def store_food(self, user_uuid: FoodUserUUID, food_va: FoodVA) -> FoodUUID:
        new_food = Food(
            uuid=uuid4(),
            user_uuid=user_uuid,
            **food_va.model_dump()
        )
        self.food_collection.insert_one(new_food.model_dump())
        return new_food.uuid

    def get_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> Optional[Food]:
        db_food = self.food_collection.find_one(
            {
                "uuid": food_uuid,
                "user_uuid": user_uuid
            }
        )
        if db_food is None:
            return None
        return Food(**db_food)

    def delete_food(self, user_uuid: FoodUserUUID, food_uuid: FoodUUID) -> None:
        delete_result = self.food_collection.delete_one(
            { "uuid": food_uuid, "user_uuid": user_uuid}
        )
        if delete_result.deleted_count != 1:
            raise FoodDoesNotExistsException
