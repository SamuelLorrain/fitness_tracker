from typing import Any

from pymongo.database import Database
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from fitness.commons.settings import Settings
from fitness.commons.singleton import Singleton


class MongoDBConnection(Singleton):
    def __init__(self) -> None:
        # TODO add url validation
        self._uri: str = Settings().MONGODB_CONNECTION_STRING
        self._uri += "?uuidRepresentation=standard" # Needed for uuid
        self._client: MongoClient = MongoClient(self._uri, server_api=ServerApi("1"))
        self._db: Database[Any] = self.client.fitness_tracker

        try:
            self.client.admin.command("ping")
        except Exception:
            print("Unable to connect to mongodb")
            exit(1)

    @property
    def client(self) -> MongoClient:
        return self._client

    @property
    def db(self) -> Database[Any]:
        return self._db
