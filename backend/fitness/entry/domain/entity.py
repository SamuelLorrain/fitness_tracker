from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel

from fitness.entry.presentation.contracts import EntryPayload, EntryTypeEnum


class Entry(BaseModel):
    uuid: UUID
    datetime: datetime
    entry_type: EntryTypeEnum
    payload: EntryPayload


class JournalRecord(BaseModel):
    """
    A journal contain a list of entry for a given date
    and some metadata. Because it's not used in the application layer,
    Journal doesn't have any handle outside of the repository for now.
    """

    uuid: UUID
    user_uuid: UUID
    date: date
    entries: list[Entry]
