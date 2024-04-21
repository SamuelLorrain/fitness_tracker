class CustomException(Exception):
    """
    Define a base class for all custom exceptions
    """
    def __init__(self, message: str = "An error occurs", name: str = "FitnessTrackerBackend"):
        self.message = message
        self.name = name

class ServiceException(CustomException):
    """
    general exception
    """

class EntityDoesNotExistsException(CustomException):
    """Define all does not exists exception"""
