from typing import Optional
from uuid import UUID, uuid4

from pydantic import EmailStr

from fitness.authentication.domain.authentication_repository import (
    AuthenticationRepository,
)
from fitness.authentication.domain.entities import Auth, Permission
from fitness.authentication.exceptions import UnknownUserException, UserAlreadyExistsException
from fitness.commons.connection import MongoDBConnection
from fitness.user.domain.entities import User


class MongoDBAuthenticationRepository(AuthenticationRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.auth_collection = self.db.auth_collection
        self.user_collection = self.db.user_collection

    def get_auth_by_email(self, email: EmailStr) -> Optional[Auth]:
        existing_user = self.user_collection.find_one({"email": email})
        if existing_user is None:
            return None
        existing_auth = self.auth_collection.find_one(
            {"user_uuid": existing_user["uuid"]}
        )
        if existing_auth is None:
            return None
        return Auth(**existing_auth)

    def store_auth_and_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> Auth:
        existing_user = self.user_collection.find_one({"email": email})
        if existing_user is not None:
            raise UserAlreadyExistsException
        user = User(
            uuid=uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=email,
            nutrition_goals_per_day=None,
        )
        auth = Auth(
            user_uuid=user.uuid,
            email=email,
            hashed_password=hashed_password,
        )
        self.user_collection.insert_one(user.model_dump())
        self.auth_collection.insert_one(auth.model_dump())
        return auth

    def set_permissions(self, user_uuid: UUID, permissions: list[Permission]) -> None:
        db_user = self.auth_collection.find_one({"user_uuid": user_uuid})
        if db_user is None:
            raise UnknownUserException
        db_user["permissions"] = permissions
        db_user = self.auth_collection.update_one(
            {"user_uuid": user_uuid}, {"$set": db_user}
        )
