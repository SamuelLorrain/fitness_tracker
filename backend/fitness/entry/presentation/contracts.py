from datetime import datetime
from uuid import UUID
from fitness.entry.domain.entity_payload import EntryPayload
from fitness.entry.domain.entry_type_enum import EntryTypeEnum
from pydantic import BaseModel


class CreateEntryRequest(BaseModel):
    datetime: datetime
    entry_type: EntryTypeEnum
    payload: EntryPayload


class EntryResponse(BaseModel):
    uuid: UUID
    user_uuid: UUID
    datetime: datetime
    entry_type: EntryTypeEnum
    payload: EntryPayload

class EntryListResponse(BaseModel):
    entries: list[EntryResponse]
