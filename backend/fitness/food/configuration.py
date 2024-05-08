
from dataclasses import dataclass

from fitness.commons.singleton import Singleton
from fitness.food.domain.barcode_service import BarcodeService
from fitness.food.domain.food_crud_service import FoodCrudService
from fitness.food.domain.food_distant_client import FoodDistantClient
from fitness.food.domain.food_repository import FoodRepository
from functools import cached_property
from fitness.food.infra.mongodb_food_repository import MongoDBFoodRepository
from fitness.food.infra.open_food_facts_distant_client import OpenFoodFactsDistantClient

@dataclass
class FoodConfiguration(Singleton):
    @cached_property
    def food_crud_service(self) -> FoodCrudService:
        return FoodCrudService(self.food_repository)

    @cached_property
    def food_repository(self) -> FoodRepository:
        return MongoDBFoodRepository()

    @property
    def food_distant_client(self) -> FoodDistantClient:
        return OpenFoodFactsDistantClient()

    @cached_property
    def barcode_service(self) -> BarcodeService:
        return BarcodeService(self.food_repository, self.food_distant_client)
