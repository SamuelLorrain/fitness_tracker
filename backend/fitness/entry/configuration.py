from dataclasses import dataclass
from functools import cached_property

from fitness.commons.singleton import Singleton
from fitness.entry.domain.entry_repository import EntryRepository
from fitness.entry.domain.entry_service import EntryService
from fitness.entry.infra.mongo_db_entry_repository import MongoDBEntryRepository


@dataclass
class EntryConfiguration(Singleton):
    @cached_property
    def entry_service(self) -> EntryService:
        return EntryService(self.entry_repository)

    @cached_property
    def entry_repository(self) -> EntryRepository:
        return MongoDBEntryRepository()
