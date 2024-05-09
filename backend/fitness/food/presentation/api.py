from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response, status

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.food.configuration import FoodConfiguration
from fitness.food.domain.entities import Food
from fitness.food.domain.food_distant_client import FoodDistant
from fitness.food.domain.value_objects import (
    Carbohydrates,
    FoodVA,
    Lipids,
    NutritionComposition,
    Proteins,
    ServingSize,
)
from fitness.food.presentation.contracts import (
    BarcodeRequest,
    FilterFoodQuery,
    FoodRequest,
    FoodResponse,
    ListFoodResponse,
    ListFoodResponseItem,
    NewFoodResponse,
    PatchFoodRequest,
)

food_router = APIRouter(prefix="/food", tags=["food"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


# TODO add multiple categories for food (custom, via api etc.)
# TODO pagination
@food_router.get("/")
def list_food(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    filter_food_query: FilterFoodQuery = Depends(),
) -> ListFoodResponse:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    list_food = food_service.list_food(auth_pass_key, filter_food_query.name_filter)
    food_response_list = [
        ListFoodResponseItem(**food.model_dump()) for food in list_food
    ]
    return ListFoodResponse(foods=food_response_list)


@food_router.get("/{food_uuid}")
def get_food(
    food_uuid: UUID,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> FoodResponse:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food = food_service.get_food(auth_pass_key, food_uuid)
    return FoodResponse.parse_obj(food.model_dump())


# TODO proper response doc
@food_router.post("/", status_code=status.HTTP_201_CREATED)
def create_food(
    food_request: FoodRequest,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    request: Request,
    response: Response,
) -> None:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food_va = FoodVA.parse_obj(food_request.model_dump())
    new_food_uuid = food_service.store_food(auth_pass_key, food_va)
    response.headers["Location"] = f"{request.url}{new_food_uuid}"


@food_router.delete("/{food_uuid}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food(
    food_uuid: UUID, pass_key: Annotated[AuthPassKey, Depends(auth_dep)]
) -> None:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food_service.delete_food(pass_key, food_uuid)


@food_router.post("/barcode")
def process_food_barcode(
    pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    barcode_request: BarcodeRequest,
) -> FoodResponse | NewFoodResponse:
    configuration = FoodConfiguration()
    barcode_service = configuration.barcode_service
    food_or_new_food = barcode_service.try_get_food_by_barcode(
        pass_key, barcode_request.text
    )
    if isinstance(food_or_new_food, Food):
        return FoodResponse(**food_or_new_food.model_dump())
    elif isinstance(food_or_new_food, FoodDistant):
        return NewFoodResponse(
            name=food_or_new_food.product.product_name,
            # FIXME There is a possibility for an xss here
            # because the barcode is sent to the user to be
            # reevaliated in the create_food() function
            barcode=barcode_request.text,
            nutrition=NutritionComposition(
                calories=food_or_new_food.product.nutriments.energy_kcal_100g,
                carbohydrates=Carbohydrates(
                    carbs=food_or_new_food.product.nutriments.carbohydrates_100g
                ),
                proteins=Proteins(
                    protein=food_or_new_food.product.nutriments.proteins_100g
                ),
                lipids=Lipids(fat=food_or_new_food.product.nutriments.fat_100g),
            ),
        )
    raise EntityDoesNotExistsException
