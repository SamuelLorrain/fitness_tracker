from typing import Optional, Protocol
from uuid import UUID

from fitness.user.domain.entities import User


class UserRepository(Protocol):
    def get_user(self, user_uuid: UUID) -> Optional[User]: ...  # pragma: no cover

    def set_user(
        self, user_uuid: UUID, user_infos: User
    ) -> None: ...  # pragma: no cover
