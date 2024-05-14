from typing import Annotated

from fastapi import APIRouter, Depends, status

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.notification.configuration import NotificationConfiguration
from fitness.notification.presentation.contracts import TokenRequest

notification_router = APIRouter(prefix="/notification", tags=["notification"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


@notification_router.put("/token", status_code=status.HTTP_204_NO_CONTENT)
def set_notification_token(
    token_request: TokenRequest,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.set_token(auth_pass_key, token_request.token)


@notification_router.get("/send-test", status_code=status.HTTP_200_OK)
def send_test_notification(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)]
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.send_test_notification(auth_pass_key)


# TODO M2M token of some kind ?
@notification_router.post("/schedule", status_code=status.HTTP_200_OK)
def schedule_notifications() -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.schedule_notifications()
