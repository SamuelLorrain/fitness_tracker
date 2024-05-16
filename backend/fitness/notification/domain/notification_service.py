from dataclasses import dataclass
from uuid import UUID

from fitness.authentication.domain.entities import AuthPassKey
from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.notification.domain.notification_client import NotificationClient
from fitness.notification.domain.notification_repository import NotificationRepository
from fitness.notification.domain.value_objects import (
    NotificationMessage,
    NotificationReceiver,
    Token,
)


@dataclass
class NotificationService:
    notification_repository: NotificationRepository
    notification_client: NotificationClient

    def set_token(self, auth_pass_key: AuthPassKey, token: Token) -> None:
        self.notification_repository.set_token(auth_pass_key.uuid, token)

    def send_notification(self, user_uuid: UUID, title: str, text: str) -> None:
        token = self.notification_repository.get_token(user_uuid)
        if token is None:
            raise EntityDoesNotExistsException
        self.notification_client.send_notification(
            NotificationMessage(title=title, text=text),
            token,
        )

    def send_test_notification(self, auth_pass_key: AuthPassKey) -> None:
        self.send_notification(
            auth_pass_key.uuid, "Test notification", "This is a test notification"
        )

    def schedule_notifications(self) -> None:
        receivers: list[NotificationReceiver] = (
            self.notification_repository.get_elligible_notification_receivers()
        )
        for receiver in receivers:
            self.notification_client.send_notification(
                NotificationMessage(
                    title="Water notification", text="don't forget to drink water"
                ),
                receiver.token,
            )
            self.notification_repository.update_water_notification_date(receiver.uuid)
