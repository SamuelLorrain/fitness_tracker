from typing import Optional, Protocol
from fitness.user.domain.entities import User
from uuid import UUID

class UserRepository(Protocol):
    def get_user(self, user_uuid: UUID) -> Optional[User]:
        ... # pragma: no cover

    def set_user(self, user_uuid: UUID, user_infos: User) -> None:
        ... # pragma: no cover
