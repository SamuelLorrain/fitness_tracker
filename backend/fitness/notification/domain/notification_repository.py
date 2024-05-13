from typing import Optional, Protocol
from uuid import UUID
from fitness.notification.domain.value_objects import Token


class NotificationRepository(Protocol):
    def set_token(self, user_uuid: UUID, token: str) -> None: ...  # pragma: no cover

    def get_token(self, user_uuid: UUID) -> Optional[Token]: ...  # pragma: no cover
