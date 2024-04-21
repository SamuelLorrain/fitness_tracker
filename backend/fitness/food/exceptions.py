from dataclasses import dataclass
from fitness.commons.exceptions import CustomException, EntityDoesNotExistsException


@dataclass
class FoodDoesNotExistsException(EntityDoesNotExistsException):
    """Raised when a fetched food doesn't exist"""


@dataclass
class InvalidAddOperation(CustomException):
    """Raised when an add operation is invalid"""
    status_code: int = 400

