from functools import cached_property
from fitness.commons.singleton import Singleton
from fitness.user.domain.user_repository import UserRepository
from fitness.user.domain.user_service import UserService
from fitness.user.infra.mongo_db_user_repository import MongoDBUserRepository


class UserConfiguration(Singleton):
    @cached_property
    def user_service(self) -> UserService:
        return UserService(self.user_repository)

    @cached_property
    def user_repository(self) -> UserRepository:
        return MongoDBUserRepository()
