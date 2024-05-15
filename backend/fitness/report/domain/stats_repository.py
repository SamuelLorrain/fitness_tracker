from datetime import date
from typing import Protocol
from uuid import UUID

from fitness.report.domain.stats import NutritionCompositionBasic


class StatsRepository(Protocol):
    def get_days_stats(
        self, user_uuid: UUID, start_date: date, end_date: date
    ) -> dict[date, NutritionCompositionBasic]: ...

    def get_weeks_stats(
        self, user_uuid: UUID, start_date: date, end_date: date
    ) -> dict[date, NutritionCompositionBasic]: ...
