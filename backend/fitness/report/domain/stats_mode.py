from typing import Protocol

from fitness.report.presentation.contracts import AggregateModeEnum, StatsModeEnum


class StatsMode(Protocol): ...


class WeeklyStatsMode(StatsMode): ...


class MonthlyStatsMode(StatsMode): ...


class YearlyStatsMode(StatsMode): ...


class StatsModeFactory:
    @staticmethod
    def create(mode_enum: StatsModeEnum) -> StatsMode:
        match mode_enum:
            case StatsModeEnum.WEEKLY:
                return WeeklyStatsMode()
            case StatsModeEnum.MONTHLY:
                return MonthlyStatsMode()
            case _:
                raise ValueError


class AggregateMode(Protocol): ...


class DailyAggregate(AggregateMode): ...


class WeeklyAggregate(AggregateMode): ...


class MonthlyAggregate(AggregateMode): ...


class AggregateModeFactory:
    @staticmethod
    def create(mode_enum: AggregateModeEnum) -> AggregateMode:
        match mode_enum:
            case AggregateModeEnum.AGGREGATE_DAILY:
                return DailyAggregate()
            case AggregateModeEnum.AGGREGATE_WEEKLY:
                return WeeklyAggregate()
            case AggregateModeEnum.AGGREGATE_MONTHLY:
                return MonthlyAggregate()
            case _:
                raise ValueError
