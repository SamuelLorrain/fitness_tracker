from datetime import date
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Request, Response

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.entry.configuration import EntryConfiguration
from fitness.entry.exceptions import EntryDoesNotExistException
from fitness.entry.presentation.contracts import (
    CreateEntryRequest,
    EntryListItemResponse,
    EntryListResponse,
    EntryResponse,
)

entry_router = APIRouter(tags=["entry"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


@entry_router.post("/entry")
def create_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    request: Request,
    response: Response,
    entry_request: CreateEntryRequest,
) -> None:
    configuration = EntryConfiguration()
    new_uuid = configuration.entry_service.create_entry(
        auth_pass_key.uuid,
        entry_request.datetime,
        entry_request.entry_type,
        entry_request.payload,
    )
    response.headers["Location"] = f"{request.url}/{new_uuid}"


@entry_router.delete("/entry/{date}/{entry_uuid}")
def delete_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    date: date,
    entry_uuid: UUID,
) -> None:
    configuration = EntryConfiguration()
    configuration.entry_service.delete_entry(
        auth_pass_key.uuid,
        entry_uuid,
        date,
    )


@entry_router.get("/entry/{date}/{entry_uuid}")
def get_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    date: date,
    entry_uuid: UUID,
) -> EntryResponse:
    configuration = EntryConfiguration()
    entry = configuration.entry_service.get_entry(auth_pass_key.uuid, date, entry_uuid)
    if entry is None:
        raise EntryDoesNotExistException
    return EntryResponse(**entry.model_dump())


@entry_router.get("/entry/{date}")
def list_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    date: date,
) -> EntryListResponse:
    configuration = EntryConfiguration()
    entries = configuration.entry_service.list_entries(
        auth_pass_key.uuid,
        date,
    )
    return EntryListResponse(
        user_uuid=auth_pass_key.uuid,
        date=date,
        entries=[EntryListItemResponse(**e.model_dump()) for e in entries],
    )
