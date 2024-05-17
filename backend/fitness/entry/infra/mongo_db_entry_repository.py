from datetime import date, datetime
from typing import Generator, Optional
from uuid import UUID, uuid4

from fitness.authentication.exceptions import UnknownUserException
from fitness.commons.connection import MongoDBConnection
from fitness.entry.domain.entity import Entry, JournalRecord
from fitness.entry.domain.entity_payload import (
    FoodPayload,
    KcalPayload,
    WaterPayload,
    WeightPayload,
)
from fitness.entry.domain.entry_repository import EntryRepository
from fitness.entry.domain.entry_type_enum import EntryTypeEnum
from fitness.entry.domain.savable_payload import SavablePayload
from fitness.entry.exceptions import EntryDoesNotExistException
from fitness.food.domain.entities import Food


class MongoDBEntryRepository(EntryRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.journal_collection = self.db.journal_collection
        self.food_collection = self.db.food_collection
        self.user_collection = self.db.user_collection

    def get_entry(self, user_uuid: UUID, date: date, entry_uuid: UUID) -> Entry:
        # NOT SURE ABOUT THIS
        db_entry = self.journal_collection.find_one(
            {
                "user_uuid": user_uuid,
                "date": datetime.combine(date, datetime.min.time()),
            }
        )
        if db_entry is None:
            raise EntryDoesNotExistException
        return Entry(**db_entry)

    def iter_entry(self, user_uuid: UUID, date: date) -> Generator[Entry, None, None]:
        db_journal_record = self.journal_collection.find_one(
            {
                "user_uuid": user_uuid,
                "date": datetime.combine(date, datetime.min.time()),
            }
        )
        if db_journal_record is None:

            def empty() -> Entry:
                return
                yield

            return empty()
        return (Entry(**entry) for entry in db_journal_record["entries"])

    def get_food(self, user_uuid: UUID, food_uuid: UUID) -> Optional[Food]:
        db_food = self.food_collection.find_one(
            {"uuid": food_uuid, "user_uuid": user_uuid}
        )
        if db_food is None:
            return None
        return Food(**db_food)

    def store_entry(
        self,
        user_uuid: UUID,
        date_time: datetime,
        entry_type: EntryTypeEnum,
        payload: SavablePayload,
    ) -> UUID:
        entry_uuid = uuid4()
        match entry_type:
            case EntryTypeEnum.water:
                new_entry = Entry(
                    uuid=entry_uuid,
                    datetime=date_time,
                    entry_type=entry_type,
                    payload=WaterPayload(
                        grams=payload.grams,
                    ),
                )
            case EntryTypeEnum.kcal:
                new_entry = Entry(
                    uuid=entry_uuid,
                    datetime=date_time,
                    entry_type=entry_type,
                    payload=KcalPayload(
                        kcal=payload.kcal,
                    ),
                )
            case EntryTypeEnum.weight:
                new_entry = Entry(
                    uuid=entry_uuid,
                    datetime=date_time,
                    entry_type=entry_type,
                    payload=WeightPayload(
                        kilo_grams=payload.kilo_grams,
                    ),
                )
            case _:
                new_entry = Entry(
                    uuid=entry_uuid,
                    datetime=date_time,
                    entry_type=entry_type,
                    payload=FoodPayload(
                        food_name=payload.food_name,
                        base_food_uuid=payload.base_food_uuid,
                        nutrition=payload.nutrition,
                    ),
                )
        db_journal_record = self._get_journal_record(user_uuid, date_time.date())
        if db_journal_record is None:
            new_db_journal_record = self._create_journal_record(
                user_uuid, date_time.date()
            )
            self.journal_collection.update_one(
                {"uuid": new_db_journal_record.uuid},
                {
                    "$push": {
                        "entries": new_entry.model_dump(),
                    }
                },
            )
        else:
            self.journal_collection.update_one(
                {
                    "user_uuid": user_uuid,
                    "date": datetime.combine(date_time.date(), datetime.min.time()),
                },
                {
                    "$push": {
                        "entries": new_entry.model_dump(),
                    }
                },
            )
        return entry_uuid

    def _get_journal_record(
        self, user_uuid: UUID, date: date
    ) -> Optional[JournalRecord]:
        db_journal_record = self.journal_collection.find_one(
            {
                "user_uuid": user_uuid,
                "date": datetime.combine(date, datetime.min.time()),
            }
        )
        if db_journal_record is None:
            return None
        return db_journal_record

    def _create_journal_record(self, user_uuid: UUID, date: date) -> JournalRecord:
        journal_record = JournalRecord(
            uuid=uuid4(),
            user_uuid=user_uuid,
            date=datetime.combine(date, datetime.min.time()),
            entries=[],
        )
        self.journal_collection.insert_one(
            {
                "uuid": journal_record.uuid,
                "user_uuid": journal_record.user_uuid,
                "date": datetime.combine(journal_record.date, datetime.min.time()),
                "entries": journal_record.entries,
            }
        )
        return journal_record

    def update_water_latest_entry_datetime(
        self, user_uuid: UUID, date_time: datetime
    ) -> None:
        db_user = self.user_collection.find_one({"uuid": user_uuid})
        if db_user is None:
            raise UnknownUserException
        db_user["water_latest_entry_date"] = date_time
        self.user_collection.update_one({"uuid": user_uuid}, {"$set": db_user})

    def delete_entry(self, user_uuid: UUID, entry_uuid: UUID, date: date) -> None:
        db_journal = self.journal_collection.find_one(
            {
                "user_uuid": user_uuid,
                "date": datetime.combine(date, datetime.min.time())
            }
        )
        print(len(db_journal["entries"]))
        entries = [entry for entry in db_journal["entries"] if entry["uuid"] != entry_uuid]
        print(len(entries))
        db_journal["entries"] = entries
        self.journal_collection.update_one(
            {
                "user_uuid": user_uuid,
                "date": datetime.combine(date, datetime.min.time())
            },
            {"$set": db_journal}
        )
