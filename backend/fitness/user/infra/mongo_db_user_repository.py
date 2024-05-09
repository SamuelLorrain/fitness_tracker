from typing import Optional
from uuid import UUID

from fitness.commons.connection import MongoDBConnection
from fitness.user.domain.entities import User
from fitness.user.domain.user_repository import UserRepository


class MongoDBUserRepository(UserRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.user_collection = self.db.user_collection

    def get_user(self, user_uuid: UUID) -> Optional[User]:
        db_user = self.user_collection.find_one({"uuid": user_uuid})
        if db_user is None:
            return None
        return User(**db_user)

    def set_user(self, user_uuid: UUID, user_infos: User) -> None:
        self.user_collection.update_one(
            {"uuid": user_uuid},
            {"$set": user_infos.model_dump()}
        )
