from typing import Callable
from pydantic import Request, JSONResponse
from fitness.commons.exceptions import CustomException


def create_exception_handler(status_code: int, initial_details: str) -> Callable[[Request, CustomException], JSONResponse]:
    details = {"message": initial_details}

    async def exception_handler(_: Request, exception: CustomException) -> JSONResponse:
        if exception.message:
            details["message"] = exception.message
        if exception.name:
            details["message"] = f"{exception.message} | {exception.name}"

        return JSONResponse(
            status_code=status_code,
            content={
                "details": details["message"]
            }
        )


    return exception_handler
