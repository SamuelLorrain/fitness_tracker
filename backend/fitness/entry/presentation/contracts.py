from datetime import datetime, date
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


class EntryListItemResponse(BaseModel):
    datetime: datetime
    entry_type: EntryTypeEnum
    payload: EntryPayload


class EntryListResponse(BaseModel):
    user_uuid: UUID
    date: date
    entries: list[EntryListItemResponse]
