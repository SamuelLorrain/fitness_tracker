

from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from fitness.entry.presentation.contracts import EntryPayload, EntryTypeEnum


class Entry(BaseModel):
    uuid: UUID
    user_uuid: UUID
    datetime: datetime
    entry_type: EntryTypeEnum
    payload: EntryPayload
