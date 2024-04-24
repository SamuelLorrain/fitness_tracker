from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from fitness.authentication.presentation.api import auth_router
from fitness.food.presentation.api import food_router

from fitness.commons.exceptions import CustomException

app = FastAPI()

@app.exception_handler(CustomException)
async def custom_exception_handler(_: Request, exc: CustomException) -> JSONResponse:
    content = None
    if exc.message is not None:
        content = {
            "details": exc.message
        }
    return JSONResponse(
        status_code=exc.status_code,
        content=content
    )


app.include_router(auth_router)
app.include_router(food_router)
