from datetime import date
from enum import Enum
from typing import Optional, OrderedDict

from pydantic import BaseModel

from fitness.report.domain.stats import NutritionCompositionBasic


class StatsModeEnum(str, Enum):
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class StatsQuery(BaseModel):
    mode: StatsModeEnum


class StatsResponse(BaseModel):
    mode: StatsModeEnum
    fields_per_day: OrderedDict[date, Optional[NutritionCompositionBasic]]
