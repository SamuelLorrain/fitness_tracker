from dataclasses import dataclass, field
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4
from fitness.entry.domain.entity import Entry
from fitness.entry.domain.entry_repository import EntryRepository
from fitness.entry.domain.savable_payload import SavablePayload
from fitness.entry.presentation.contracts import EntryTypeEnum
from fitness.food.domain.entities import Food
from fitness.food.exceptions import FoodDoesNotExistsException
from fitness.entry.exceptions import EntryDoesNotExistException


@dataclass
class InMemoryEntryRepository(EntryRepository):
    data: dict[tuple[UUID, date], list[Entry]] = field(default_factory=dict)
    food_data: dict[UUID, Food] = field(default_factory=dict)

    def create_entry(
        self,
        user_uuid: UUID,
        datetime: datetime,
        entry_type: EntryTypeEnum,
        payload: SavablePayload
    ) -> UUID:
        date = datetime.date()
        uuid = uuid4()
        entry = Entry(
            uuid=uuid,
            user_uuid=user_uuid,
            datetime=datetime,
            entry_type=entry_type,
            payload=payload
        )
        if self.data.get((user_uuid, date)) is not None:
            self.data[(user_uuid, date)].append(entry)
        else:
            self.data[(user_uuid, date)] = [entry]
        return uuid


    def get_entry(
        self,
        user_uuid: UUID,
        date: date,
        entry_uuid: UUID
    ) -> Entry:
        entries = self.data[(user_uuid, date)]
        filtered = [e for e in entries if e.uuid == entry_uuid]
        if len(filtered) >= 1:
            return filtered[0]
        raise EntryDoesNotExistException


    def get_entry_list(
        self,
        user_uuid: UUID,
        date: date
    ) -> list[Entry]:
        return self.data.get((user_uuid, date), [])


    def get_food(self, user_uuid: UUID, food_uuid: UUID) -> Optional[Food]:
        food = self.food_data.get(food_uuid)
        return food
