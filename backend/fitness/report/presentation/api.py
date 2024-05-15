from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends

from fitness.authentication.configuration import AuthenticationConfiguration
from fitness.authentication.domain.entities import AuthPassKey
from fitness.report.configuration import ReportConfiguration
from fitness.report.presentation.contracts import StatsQuery, StatsResponse

report_router = APIRouter(prefix="/report", tags=["report"])
auth_dep = AuthenticationConfiguration().authorisation_dependency


# TODO can be exported if a ".csv" or a ".json" is given ?
@report_router.get("/")
def get_stats(
    stats_query: Annotated[StatsQuery, Depends()],
    auth_pass_key: Annotated[AuthPassKey, Depends(auth_dep)],
) -> StatsResponse:
    configuration = ReportConfiguration()
    report_service = configuration.report_service
    stats = report_service.process_stats(
        auth_pass_key, stats_query.mode, stats_query.aggregate, date.today()
    )
    return StatsResponse(mode=stats_query.mode, fields_per_day=stats.fields_per_day)
