from fitness.commons.settings import Settings
from fitness.commons.singleton import Singleton
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class MongoDBConnection(Singleton):
    def __init__(self) -> None:
        self._uri = Settings().MONGODB_CONNECTION_STRING
        self._client: MongoClient = MongoClient(self._uri, server_api=ServerApi("1"))
        self._db = self.client.fitness_tracker

        try:
            self.client.admin.command("ping")
        except Exception:
            print("Unable to connect to mongodb")
            exit(1)


    @property
    def client(self) -> MongoClient:
        return self._client

    @property
    def db(self) -> MongoClient:
        return self._db
