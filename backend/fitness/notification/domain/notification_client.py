from typing import Protocol

from fitness.notification.domain.value_objects import NotificationMessage, Token


class NotificationClient(Protocol):

    def send_notification(
        self, message: NotificationMessage, token: Token
    ) -> None: ...  # pragma: no cover
