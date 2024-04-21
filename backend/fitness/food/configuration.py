
from dataclasses import dataclass
from fitness.commons.singleton import Singleton
from fitness.food.domain.food_crud_service import FoodCrudService
from fitness.food.domain.food_repository import FoodRepository
from fitness.food.infra.in_memory_food_repository import InMemoryFoodRepository
from functools import cached_property

@dataclass
class FoodConfiguration(Singleton):
    @cached_property
    def food_crud_service(self) -> FoodCrudService:
        return FoodCrudService(self.food_repository)

    @cached_property
    def food_repository(self) -> FoodRepository:
        return InMemoryFoodRepository()
