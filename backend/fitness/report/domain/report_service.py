from dataclasses import dataclass
from datetime import date, datetime, timedelta
from functools import singledispatchmethod
from typing import Optional
from uuid import UUID

from fitness.authentication.domain.entities import AuthPassKey
from fitness.report.domain.stats import NutritionCompositionBasic, Stats
from fitness.report.domain.stats_mode import (
    AggregateMode,
    AggregateModeFactory,
    DailyAggregate,
    MonthlyStatsMode,
    StatsMode,
    StatsModeFactory,
    WeeklyAggregate,
    WeeklyStatsMode,
    YearlyStatsMode,
)
from fitness.report.domain.stats_repository import StatsRepository
from fitness.report.presentation.contracts import AggregateModeEnum, StatsModeEnum


@dataclass
class StatsInformations:
    """
    Informations used to compute the stats
    """

    user_uuid: UUID
    start_date: date
    end_date: date

    def _format(self, db_stats: dict) -> Stats:
        stats = Stats()
        current_stat: Optional[NutritionCompositionBasic] = None
        current_date = datetime.combine(self.start_date, datetime.min.time())
        while current_date < datetime.combine(self.end_date, datetime.max.time()):
            current_stat = db_stats.get(current_date)
            stats.fields_per_day[current_date] = (
                current_stat  # regardless if it's None or not
            )
            current_date += timedelta(days=1)
        return stats

    def _week_aggregate(self, stats: Stats) -> Stats: ...

    @singledispatchmethod
    def compute(self, _: AggregateMode, state_repository: StatsRepository) -> Stats:
        raise NotImplementedError

    @compute.register
    def _(self, aggregate: DailyAggregate, stats_repository: StatsRepository) -> Stats:
        db_stats = stats_repository.get_days_stats(
            self.user_uuid, self.start_date, self.end_date
        )
        return self._format(db_stats)

    @compute.register
    def _(self, aggregate: WeeklyAggregate, stats_repository: StatsRepository) -> Stats:
        db_stats = stats_repository.get_weeks_stats(
            self.user_uuid, self.start_date, self.end_date
        )
        return self._format(db_stats)


@dataclass
class StatsInformationBuilder:
    user_uuid: UUID

    @singledispatchmethod
    def build_stats_informations(
        self, _: StatsMode, end_date: date
    ) -> StatsInformations:
        raise NotImplementedError

    @build_stats_informations.register
    def _(self, _: WeeklyStatsMode, end_date: date) -> StatsInformations:
        return StatsInformations(
            user_uuid=self.user_uuid,
            start_date=end_date - timedelta(days=7),
            end_date=end_date,
        )

    @build_stats_informations.register
    def _(self, _: MonthlyStatsMode, end_date: date) -> StatsInformations:
        return StatsInformations(
            user_uuid=self.user_uuid,
            start_date=end_date - timedelta(days=30),
            end_date=end_date,
        )

    @build_stats_informations.register
    def _(self, _: YearlyStatsMode, end_date: date) -> StatsInformations:
        return StatsInformations(
            user_uuid=self.user_uuid,
            start_date=end_date - timedelta(days=365),
            end_date=end_date,
        )


@dataclass
class ReportService:
    stats_repository: StatsRepository

    def process_stats(
        self,
        auth_pass_key: AuthPassKey,
        mode: StatsModeEnum,
        aggregate: AggregateModeEnum,
        end_date: date,
    ) -> Stats:
        stats_mode = StatsModeFactory.create(mode)
        aggregate_mode = AggregateModeFactory.create(aggregate)
        stats_informations = StatsInformationBuilder(
            auth_pass_key.uuid
        ).build_stats_informations(stats_mode, end_date)
        stats = stats_informations.compute(aggregate_mode, self.stats_repository)
        return stats
