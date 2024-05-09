from dataclasses import dataclass
from typing import Optional

from fitness.commons.exceptions import CustomException, EntityDoesNotExistsException


@dataclass
class UserAlreadyExistsException(CustomException):
    """Raise when a user already exist"""

    status_code: int = 409
    message: Optional[str] = "The user already exists"


@dataclass
class UnknownUserException(EntityDoesNotExistsException):
    """Raise when a user does not exists"""


@dataclass
class BadPasswordException(CustomException):
    """Raise when a the password entered is bad"""

    status_code: int = 401
    message: Optional[str] = "Unable to login"


@dataclass
class UnableToLoginException(CustomException):
    """Raise when a the password entered is bad"""

    status_code: int = 401
    message: Optional[str] = "Unable to login"
