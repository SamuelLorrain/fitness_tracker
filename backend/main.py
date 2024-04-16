from fastapi import FastAPI

from fitness.authentication.presentation.api import auth_router

app = FastAPI()
app.include_router(auth_router)
