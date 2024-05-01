from dataclasses import dataclass
from typing import Optional
from uuid import UUID
from datetime import date, datetime

from fitness.entry.domain.entity import Entry
from fitness.entry.domain.entity_payload import FoodPayload, KcalPayload, WaterPayload
from fitness.entry.domain.entry_repository import EntryRepository
from fitness.entry.domain.savable_payload import FoodSavablePayload, KCalSavablePayload, SavablePayload, WaterSavablePayload
from fitness.entry.presentation.contracts import EntryPayload, EntryTypeEnum
from fitness.food.exceptions import FoodDoesNotExistsException

@dataclass
class EntryService:
    entry_repository: EntryRepository

    def create_entry(
        self,
        user_uuid: UUID,
        datetime: datetime,
        entry_type: EntryTypeEnum,
        payload: EntryPayload
    ) -> UUID:
        # TODO verify that entry_type is compatible with payload
        # TODO use some kind of dispatch
        savable: SavablePayload
        if isinstance(payload, FoodPayload):
            food = self.entry_repository.get_food(
                user_uuid,
                payload.base_food_uuid
            )
            if food is None:
                raise FoodDoesNotExistsException
            savable = FoodSavablePayload(
                **payload.nutrition.model_dump()
            )
        elif isinstance(payload, WaterPayload):
            savable = WaterSavablePayload(
                grams=payload.grams
            )
        else:
            savable = KCalSavablePayload(
                kcal=payload.kcal
            )
        return self.entry_repository.create_entry(
            user_uuid,
            datetime,
            entry_type,
            savable
        )

    def get_entry(
        self,
        user_uuid: UUID,
        date: date,
        entry_uuid: UUID
    ) -> Optional[Entry]:
        return self.entry_repository.get_entry(
            user_uuid,
            date,
            entry_uuid
        )

    def list_entries(
        self,
        user_uuid: UUID,
        date: date
    ) -> list[Entry]:
        return self.entry_repository.get_entry_list(
            user_uuid,
            date,
        )

    # def delete_entry(self, user_uuid: UUID, entry_uuid: UUID, date: date):
    #     return self.entry_repository.delete_entry()
