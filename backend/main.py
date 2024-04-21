from fastapi import FastAPI

from fitness.authentication.presentation.api import auth_router
from fitness.food.presentation.api import food_router

app = FastAPI()
app.include_router(auth_router)
app.include_router(food_router)
