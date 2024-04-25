from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, Response, Request
from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.commons.exceptions import EntityDoesNotExistsException
from fitness.entry.domain.entry_service import EntryService
from fitness.entry.infra.in_memory_entry_repository import InMemoryEntryRepository
from fitness.entry.presentation.contracts import CreateEntryRequest, EntryListResponse, EntryResponse
from datetime import date

entry_router = APIRouter(tags=["entry"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


service = EntryService(
    entry_repository=InMemoryEntryRepository()
)

@entry_router.post('/entry')
def create_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    request: Request,
    response: Response,
    entry_request: CreateEntryRequest
) -> None:
    global service
    new_uuid = service.create_entry(
        auth_pass_key.uuid,
        entry_request.datetime,
        entry_request.entry_type,
        entry_request.payload
    )
    response.headers["Location"] = f"{request.url}/{new_uuid}"


@entry_router.get("/entry/{date}/{entry_uuid}")
def get_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    date: date,
    entry_uuid: UUID
) -> EntryResponse:
    global service
    entry = service.get_entry(
        auth_pass_key.uuid,
        date,
        entry_uuid
    )
    if entry is None:
        raise EntityDoesNotExistsException
    return EntryResponse(**entry.model_dump())


@entry_router.get("/entry/{date}")
def list_entry(
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
    date: date,
) -> EntryListResponse:
    global service
    entries = service.list_entries(
        auth_pass_key.uuid,
        date,
    )
    return EntryListResponse(entries=[EntryResponse(**e.model_dump()) for e in entries])
