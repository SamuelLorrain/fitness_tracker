from datetime import date, datetime
from uuid import UUID

from fitness.commons.connection import MongoDBConnection
from fitness.report.domain.report_service import Stats
from fitness.report.domain.stats import NutritionCompositionBasic
from fitness.report.domain.stats_repository import StatsRepository


class MongoDbStatsRepository(StatsRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.journal_collection = self.db.journal_collection

    def get_days_stats(
        self, user_uuid: UUID, start_date: date, end_date: date
    ) -> dict[date, NutritionCompositionBasic]:
        pipeline = [
            {
                "$match": {
                    "user_uuid": user_uuid,
                    "date": {
                        "$gte": datetime.combine(start_date, datetime.min.time()),
                        "$lte": datetime.combine(end_date, datetime.max.time()),
                    },
                },
            },
            {"$unwind": "$entries"},
            {
                "$group": {
                    "_id": "$date",
                    "calories_in_kcal": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "food"]
                                        },
                                        "then": "$entries.payload.nutrition.calories",
                                    },
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "kcal"]
                                        },
                                        "then": "$entries.payload.kcal",
                                    },
                                ],
                                "default": 0,
                            }
                        }
                    },
                    "proteins_in_grams": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "food"]
                                        },
                                        "then": "$entries.payload.nutrition.proteins.protein",
                                    },
                                ],
                                "default": 0,
                            }
                        }
                    },
                    "lipids_in_grams": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "food"]
                                        },
                                        "then": "$entries.payload.nutrition.lipids.fat",
                                    },
                                ],
                                "default": 0,
                            }
                        }
                    },
                    "carbs_in_grams": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "food"]
                                        },
                                        "then": "$entries.payload.nutrition.carbohydrates.carbs",
                                    },
                                ],
                                "default": 0,
                            }
                        }
                    },
                    "water_in_grams": {
                        "$sum": {
                            "$switch": {
                                "branches": [
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "food"]
                                        },
                                        "then": "$entries.payload.nutrition.water",
                                    },
                                    {
                                        "case": {
                                            "$eq": ["$entries.entry_type", "water"]
                                        },
                                        "then": "$entries.payload.grams",
                                    },
                                ],
                                "default": 0,
                            }
                        }
                    },
                }
            },
        ]
        entries = self.journal_collection.aggregate(pipeline)
        return {stat["_id"]: NutritionCompositionBasic(**stat) for stat in entries}
