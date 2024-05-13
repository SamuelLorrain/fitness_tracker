from typing import Optional
from uuid import UUID
from fitness.authentication.exceptions import UnknownUserException
from fitness.commons.connection import MongoDBConnection
from fitness.notification.domain.notification_repository import NotificationRepository
from fitness.notification.domain.value_objects import Token


class MongoDbNotificationRepository(NotificationRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.auth_collection = self.db.auth_collection

    def set_token(self, user_uuid: UUID, token: str) -> None:
        db_auth = self.auth_collection.find_one({"user_uuid": user_uuid})
        if db_auth is None:
            raise UnknownUserException
        db_auth["notification_token"] = token
        self.auth_collection.update_one({"user_uuid": user_uuid}, {"$set": db_auth})

    def get_token(self, user_uuid: UUID) -> Optional[Token]:
        db_auth = self.auth_collection.find_one({"user_uuid": user_uuid})
        if db_auth is None:
            raise UnknownUserException
        return db_auth.get("notification_token")
