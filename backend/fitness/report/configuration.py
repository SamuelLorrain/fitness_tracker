from dataclasses import dataclass

from fitness.commons.singleton import Singleton
from fitness.report.domain.report_service import ReportService
from fitness.report.domain.stats_repository import StatsRepository
from fitness.report.infra.mongo_db_stats_repository import MongoDbStatsRepository


@dataclass
class ReportConfiguration(Singleton):

    @property
    def report_service(self) -> ReportService:
        return ReportService(self.stats_repository)

    @property
    def stats_repository(self) -> StatsRepository:
        return MongoDbStatsRepository()
