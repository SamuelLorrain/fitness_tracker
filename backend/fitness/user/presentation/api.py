from typing import Annotated

from fastapi import APIRouter, Depends, status

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.user.configuration import UserConfiguration
from fitness.user.presentation.contracts import (
    UserBasicInfosRequest,
    UserGoalsRequest,
    UserResponse,
    UserWaterNotificationSettingsRequest,
)

user_router = APIRouter(prefix="/user", tags=["user"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


@user_router.get("/")
def get_current_user_infos(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> UserResponse:
    configuration = UserConfiguration()
    service = configuration.user_service
    user = service.get_user(auth_pass_key.uuid)
    return UserResponse(**user.model_dump())


@user_router.put("/goals", status_code=status.HTTP_204_NO_CONTENT)
def set_current_user_goals(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    user_goals_request: UserGoalsRequest,
) -> None:
    configuration = UserConfiguration()
    service = configuration.user_service
    service.set_nutrition_goals_for_user(
        auth_pass_key.uuid, user_goals_request.nutrition_goals_per_day
    )


@user_router.put("/", status_code=status.HTTP_204_NO_CONTENT)
def set_current_user_basic_infos(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    user_basic_infos_request: UserBasicInfosRequest,
) -> None:
    configuration = UserConfiguration()
    service = configuration.user_service
    service.set_user_basic_infos(
        auth_pass_key.uuid, **user_basic_infos_request.model_dump()
    )


@user_router.put("/water-notification", status_code=status.HTTP_204_NO_CONTENT)
def set_user_water_notification(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    water_request: UserWaterNotificationSettingsRequest,
) -> None:
    configuration = UserConfiguration()
    service = configuration.user_service
    service.set_water_notification_settings(
        auth_pass_key.uuid,
        water_request.notification_enabled,
        water_request.notification_delta_hours,
    )


@user_router.get("/water-notification/test", status_code=status.HTTP_204_NO_CONTENT)
def test_user_water_notification(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> None:
    configuration = UserConfiguration()
    service = configuration.user_service
    service.test_user_water_notification(auth_pass_key.uuid)
