from datetime import date, datetime
from typing import Optional, Protocol
from uuid import UUID

from fitness.entry.domain.entity import Entry
from fitness.entry.domain.entry_type_enum import EntryTypeEnum
from fitness.entry.domain.savable_payload import SavablePayload
from fitness.food.domain.entities import Food


class EntryRepository(Protocol):
    def create_entry(
        self,
        user_uuid: UUID,
        datetime: datetime,
        entry_type: EntryTypeEnum,
        payload: SavablePayload
    ) -> UUID:
        ... # pragma: no cover

    def get_entry(
        self,
        user_uuid: UUID,
        date: date,
        entry_uuid: UUID
    ) -> Entry:
        ... # pragma: no cover

    def get_entry_list(
        self,
        user_uuid: UUID,
        date: date
    ) -> list[Entry]:
        ... # pragma: no cover

    def get_food(self, user_uuid: UUID, food_uuid: UUID) -> Optional[Food]:
        ... # pragma: no cover
