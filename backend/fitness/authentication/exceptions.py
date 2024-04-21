from fitness.commons.exceptions import CustomException, EntityDoesNotExistsException


class UserAlreadyExistsException(CustomException):
    """Raise when a user already exist"""


class UnknownUserException(EntityDoesNotExistsException):
    """Raise when a user does not exists"""


class BadPasswordException(CustomException):
    """Raise when a the password entered is bad"""
