from typing import Optional
from uuid import uuid4

from fitness.commons.connection import MongoDBConnection
from pydantic import EmailStr

from fitness.authentication.domain.entities import User
from fitness.authentication.domain.user_repository import UserRepository
from fitness.authentication.exceptions import UserAlreadyExistsException


class MongoDBUserRepository(UserRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.user_collection = self.db.user_collection

    def get_user_by_email(self, email: EmailStr) -> Optional[User]:
        existing_user = self.user_collection.find_one({"email": email})
        if existing_user is None:
            return None
        return User(**existing_user)

    def store_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> User:
        existing_user = self.user_collection.find_one({"email": email})
        if existing_user is not None:
            raise UserAlreadyExistsException
        user = User(
            uuid=uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
        )
        self.user_collection.insert_one(user.dict())
        return user
