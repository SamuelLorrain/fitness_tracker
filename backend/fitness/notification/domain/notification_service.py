from dataclasses import dataclass

from fitness.authentication.domain.entities import AuthPassKey
from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.notification.domain.value_objects import NotificationMessage, Token
from fitness.notification.domain.notification_repository import NotificationRepository
from fitness.notification.domain.notification_client import NotificationClient


@dataclass
class NotificationService:
    notification_repository: NotificationRepository
    notification_client: NotificationClient

    def set_token(self, auth_pass_key: AuthPassKey, token: Token) -> None:
        self.notification_repository.set_token(auth_pass_key.uuid, token)

    def send_test_notification(self, auth_pass_key: AuthPassKey) -> None:
        token = self.notification_repository.get_token(auth_pass_key.uuid)
        if token is None:
            raise EntityDoesNotExistsException
        self.notification_client.send_notification(
            NotificationMessage(
                title="Test notification", text="This is a test notification"
            ),
            token,
        )

    def schedule_notifications(self) -> None:
        # tokens = self.notification_repository.get_elligible_users_tokens()
        ...
