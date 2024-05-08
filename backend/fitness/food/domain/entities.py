from typing import Optional
from fitness.food.domain.value_objects import FoodCategory, FoodGroup, NutritionComposition, ServingSize
from pydantic import BaseModel, Field
from uuid import UUID


class Food(BaseModel):
    uuid: UUID
    user_uuid: Optional[UUID]
    barcode_value: Optional[str] = None
    name: str = Field(min_length=1)
    nutrition: NutritionComposition = Field(default_factory=lambda:NutritionComposition())
    group: FoodGroup = Field(default=FoodGroup.unknown)
    category: FoodCategory = Field(default=FoodCategory.custom)
    # TODO Two more routes to handle the additional serving sizes and ingredient list
    # (need an append and a delete operation different from simple patch)
    additional_serving_sizes: list[ServingSize] = Field(default_factory=list)
    ingredient_list: list[str] = Field(default_factory=list)
