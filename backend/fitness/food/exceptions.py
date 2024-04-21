from fitness.commons.exceptions import CustomException, EntityDoesNotExistsException


class FoodDoesNotExistsException(EntityDoesNotExistsException):
    """Raised when a fetched food doesn't exist"""

class InvalidAddOperation(CustomException):
    """Raised when an add operation is invalid"""

