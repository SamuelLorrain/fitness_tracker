from typing import Optional
from uuid import UUID
from fitness.food.domain.value_objects import FoodGroup, NutritionComposition, OptionalNutritionComposition, ServingSize
from pydantic import BaseModel, Field, ConfigDict


class FilterFoodQuery(BaseModel):
    name_filter: Optional[str] = None


class FoodRequest(BaseModel):
    model_config: ConfigDict = ConfigDict({
        "extra": 'forbid'
    })

    name: str = Field(min_length=1)
    group: FoodGroup = Field(default=FoodGroup.unknown)
    nutrition: NutritionComposition = Field(default_factory=lambda:NutritionComposition())
    ingredient_list: list[str] = Field(default_factory=list)


class PatchFoodRequest(BaseModel):
    name: Optional[str] = None
    group: Optional[FoodGroup] = None
    nutrition: Optional[OptionalNutritionComposition] = None


class FoodResponse(BaseModel):
    uuid: UUID
    name: str
    nutrition: NutritionComposition
    group: FoodGroup
    additional_serving_sizes: list[ServingSize]
    ingredient_list: list[str]

class ListFoodResponse(BaseModel):
    foods: list[FoodResponse]
