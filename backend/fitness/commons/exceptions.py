from dataclasses import dataclass
from typing import Optional


@dataclass
class CustomException(Exception):
    """ Define a base class for all custom exceptions """
    message: Optional[str] = "Internal Server Error"
    status_code: int = 500

@dataclass
class ServiceException(CustomException):
    """ general exception """

@dataclass
class EntityDoesNotExistsException(CustomException):
    """Define all does not exists exception"""
    status_code: int = 404
    message: Optional[str] = "Entity doesn't exist"
