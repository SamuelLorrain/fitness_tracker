from typing import Annotated

from fastapi import APIRouter, Depends, status

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey, Permission
from fitness.notification.configuration import NotificationConfiguration
from fitness.notification.presentation.contracts import (
    NotificationRequest,
    TokenRequest,
)

notification_router = APIRouter(prefix="/notification", tags=["notification"])
auth_dep = AuthenticationConfiguration().authorisation_dependency
auth_permission_dep = (
    AuthenticationConfiguration().authorisation_permission_dependency_creator
)


@notification_router.put("/token", status_code=status.HTTP_204_NO_CONTENT)
def set_notification_token(
    token_request: TokenRequest,
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.set_token(auth_pass_key, token_request.token)


@notification_router.post("/send-test", status_code=status.HTTP_200_OK)
def send_test_notification(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)]
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.send_test_notification(auth_pass_key)


@notification_router.post("/schedule", status_code=status.HTTP_200_OK)
def schedule_notifications(
    _: Annotated[
        AuthPassKey, Depends(auth_permission_dep(Permission.schedule_notifications))
    ]
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.schedule_notifications()


@notification_router.post("/send", status_code=status.HTTP_200_OK)
def send_notification_to_user(
    notification_request: NotificationRequest,
    _: Annotated[
        AuthPassKey,
        Depends(auth_permission_dep(Permission.send_notification_to_any_user)),
    ],
) -> None:
    configuration = NotificationConfiguration()
    service = configuration.notification_service
    service.send_notification(
        notification_request.user_uuid,
        notification_request.title,
        notification_request.text,
    )
