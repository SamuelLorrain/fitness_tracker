from fitness.commons.exceptions import CustomException


class FoodDoesNotExistsException(CustomException):
    """Raised when a fetched food doesn't exist"""

class InvalidAddOperation(CustomException):
    """Raised when an add operation is invalid"""

