from dataclasses import dataclass
from typing import Optional
from fitness.commons.exceptions import EntityDoesNotExistsException

@dataclass
class EntryDoesNotExistException(EntityDoesNotExistsException):
    """ When an entry does not exists """
    message: Optional[str] = "Entry doesn't exist"
