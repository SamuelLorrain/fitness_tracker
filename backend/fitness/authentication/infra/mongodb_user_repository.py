from typing import Optional
from uuid import uuid4

from pydantic import EmailStr
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from fitness.authentication.domain.entities import User
from fitness.authentication.domain.user_repository import UserRepository
from fitness.authentication.exceptions import UserAlreadyExistsException
from fitness.commons.settings import Settings

# TODO put in a configuration (may need to add a mutex?)
uri = Settings().MONGODB_CONNECTION_STRING
client: MongoClient = MongoClient(uri, server_api=ServerApi("1"))
db = client.fitness_tracker
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
    exit(1)


class MongoDBUserRepository(UserRepository):
    def get_user_by_email(self, email: EmailStr) -> Optional[User]:
        existing_user = db.user_collection.find_one({"email": email})
        if existing_user is None:
            return None
        return User(**existing_user)

    def store_user(
        self, first_name: str, last_name: str, email: EmailStr, hashed_password: bytes
    ) -> User:
        existing_user = db.user_collection.find_one({"email": email})
        if existing_user is not None:
            raise UserAlreadyExistsException
        user = User(
            uuid=uuid4(),
            first_name=first_name,
            last_name=last_name,
            email=email,
            hashed_password=hashed_password,
        )
        user_collection = db.user_collection
        user_collection.insert_one(user.dict())
        return user
