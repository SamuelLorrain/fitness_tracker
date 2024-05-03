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
        if db_user.get("nutrition_goals_per_day") is None:
            return User(**db_user, nutrition_goals_per_day=None)
        return User(**db_user)
