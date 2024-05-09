from dataclasses import dataclass
from typing import Optional

from fitness.commons.exceptions import CustomException, EntityDoesNotExistsException


@dataclass
class FoodDoesNotExistsException(EntityDoesNotExistsException):
    message: Optional[str] = "food entity doesn't exists"
    """Raised when a fetched food doesn't exist"""


@dataclass
class InvalidAddOperation(CustomException):
    """Raised when an add operation is invalid"""
    status_code: int = 400

