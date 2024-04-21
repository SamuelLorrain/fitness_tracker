
from dataclasses import dataclass
from fitness.commons.singleton import Singleton
from fitness.food.domain.food_crud_service import FoodCrudService
from fitness.food.domain.food_repository import FoodRepository
from functools import cached_property
from fitness.food.infra.mongodb_food_repository import MongoDBFoodRepository

@dataclass
class FoodConfiguration(Singleton):
    @cached_property
    def food_crud_service(self) -> FoodCrudService:
        return FoodCrudService(self.food_repository)

    @cached_property
    def food_repository(self) -> FoodRepository:
        return MongoDBFoodRepository()
