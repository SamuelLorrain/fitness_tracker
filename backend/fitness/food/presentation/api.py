from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, status, Response, Request
from fitness.authentication.domain.entities import AuthPassKey
from fitness.food.configuration import FoodConfiguration
from fitness.food.domain.value_objects import FoodVA
from fitness.food.presentation.contracts import FilterFoodQuery, FoodRequest, FoodResponse, ListFoodResponse, PatchFoodRequest
from fitness.authentication.configuration import AuthenticationConfiguration


food_router = APIRouter(prefix="/food", tags=["food"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


# TODO add multiple categories for food (custom, via api etc.)
# TODO pagination
@food_router.get('/')
def list_food(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    filter_food_query: FilterFoodQuery = Depends(),
) -> ListFoodResponse:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    list_food = food_service.list_food(auth_pass_key, filter_food_query.name_filter)
    food_response_list = [FoodResponse(**food.model_dump()) for food in list_food]
    return ListFoodResponse(foods=food_response_list)


@food_router.get('/{food_uuid}')
def get_food(
    food_uuid: UUID,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> FoodResponse:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food = food_service.get_food(auth_pass_key, food_uuid)
    return FoodResponse.parse_obj(food.model_dump())


# TODO proper response doc
@food_router.post('/', status_code=status.HTTP_201_CREATED)
def create_food(
    food_request: FoodRequest,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    request: Request,
    response: Response
) -> None:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food_va = FoodVA.parse_obj(food_request.model_dump())
    new_food_uuid = food_service.store_food(auth_pass_key, food_va)
    response.headers["Location"] = f"{request.url}{new_food_uuid}"

# TODO real patch
# @food_router.patch('/{food_uuid}', status_code=status.HTTP_204_NO_CONTENT)
# def patch_food(
#     food_uuid: UUID,
#     pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
#     patch_food_request: PatchFoodRequest
# ) -> Response:
#     configuration = FoodConfiguration()
#     food_service = configuration.food_crud_service
#     food_service.patch_food(
#         pass_key,
#         food_uuid,
#         patch_food_request.model_dump(exclude_unset=True)
#     )


@food_router.delete('/{food_uuid}', status_code=status.HTTP_204_NO_CONTENT)
def delete_food(
    food_uuid: UUID,
    pass_key: Annotated[AuthPassKey, Depends(auth_dep)]
) -> None:
    configuration = FoodConfiguration()
    food_service = configuration.food_crud_service
    food_service.delete_food(pass_key, food_uuid)
