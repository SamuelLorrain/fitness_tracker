from typing import Annotated
from fastapi import APIRouter, Depends, Request
from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
import json
from datetime import datetime, timezone

debug_router = APIRouter(prefix="/debug", tags=["debug"])
auth_dep = AuthenticationConfiguration().authorisation_dependency

@debug_router.post('/')
async def post_debug_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    request: Request
) -> None:
    try:
        payload = await request.json()
        print({"datetime": datetime.now(tz=timezone.utc), "user_email": auth_pass_key.email, "payload": payload})
    except json.decoder.JSONDecodeError:
        payload = await request.body()
        print({"datetime": datetime.now(tz=timezone.utc), "user_email": auth_pass_key.email, "payload": payload})
