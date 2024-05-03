from typing import Annotated
from fastapi import APIRouter, Depends
from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.user.configuration import UserConfiguration
from fitness.user.presentation.contracts import UserResponse

user_router = APIRouter(prefix="/user", tags=["user"])
auth_dep = AuthenticationConfiguration().authorisation_dependency

@user_router.get('/')
def get_current_user_infos(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> UserResponse:
    configuration = UserConfiguration()
    service = configuration.user_service
    user = service.get_user(auth_pass_key.uuid)
    return UserResponse(**user.model_dump())

