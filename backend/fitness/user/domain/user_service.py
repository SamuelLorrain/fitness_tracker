from dataclasses import dataclass
from uuid import UUID

from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.user.domain.entities import User
from fitness.user.domain.user_repository import UserRepository

@dataclass
class UserService:
    user_repository: UserRepository

    def get_user(self , user_uuid: UUID) -> User:
        db_user = self.user_repository.get_user(user_uuid)
        if db_user is None:
            raise EntityDoesNotExistsException
        return db_user
