from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from bson.binary import UuidRepresentation
from bson.codec_options import CodecOptions

from fitness.authentication.exceptions import UnknownUserException
from fitness.commons.connection import MongoDBConnection
from fitness.notification.domain.notification_repository import NotificationRepository
from fitness.notification.domain.value_objects import NotificationReceiver, Token


class MongoDbNotificationRepository(NotificationRepository):
    def __init__(self):
        self.db = MongoDBConnection().db
        self.auth_collection = self.db.auth_collection
        self.user_collection = self.db.get_collection(
            "user_collection",
            codec_options=CodecOptions(
                tz_aware=True,
                tzinfo=timezone.utc,
                uuid_representation=UuidRepresentation.STANDARD,
            ),
        )

    def set_token(self, user_uuid: UUID, token: str) -> None:
        db_auth = self.auth_collection.find_one({"user_uuid": user_uuid})
        if db_auth is None:
            raise UnknownUserException
        db_auth["notification_token"] = token
        self.auth_collection.update_one({"user_uuid": user_uuid}, {"$set": db_auth})

    def get_token(self, user_uuid: UUID) -> Optional[Token]:
        db_auth = self.auth_collection.find_one({"user_uuid": user_uuid})
        if db_auth is None:
            raise UnknownUserException
        return db_auth.get("notification_token")

    def get_elligible_notification_receivers(self) -> list[NotificationReceiver]:
        elligible_user_query = {
            "$match": {
                "$expr": {
                    "$and": [
                        {"$eq": ["$notification_enabled", True]},
                        {
                            "$or": [
                                {"$eq": ["$latest_water_entry", None]},
                                {"$eq": [{"$type": "$latest_water_entry"}, "missing"]},
                                {
                                    "$lte": [
                                        "$latest_water_entry",
                                        {
                                            "$subtract": [
                                                datetime.now(tz=timezone.utc),
                                                {
                                                    "$multiply": [
                                                        "$notification_delta_hours",
                                                        3600000,
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            "$or": [
                                {"$eq": ["$latest_water_notification", None]},
                                {
                                    "$eq": [
                                        {"$type": "$latest_water_notification"},
                                        "missing",
                                    ]
                                },
                                {
                                    "$lte": [
                                        "$latest_water_notification",
                                        {
                                            "$subtract": [
                                                datetime.now(tz=timezone.utc),
                                                {
                                                    "$multiply": [
                                                        "$notification_delta_hours",
                                                        3600000,
                                                    ]
                                                },
                                            ]
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                }
            }
        }
        join_token = {
            "$lookup": {
                "from": "auth_collection",
                "localField": "uuid",
                "foreignField": "user_uuid",
                "as": "user_mapping",
            }
        }
        auth_filter = {"$match": {"$expr": {"$ne": ["$user_mapping.token", None]}}}
        filter = [
            {"$set": {"user_mapping": {"$first": "$user_mapping"}}},
            {"$set": {"uuid": "$uuid", "token": "$user_mapping.notification_token"}},
            {
                "$unset": [
                    "email",
                    "first_name",
                    "last_name",
                    "nutrition_goals_per_day",
                    "user_mapping",
                ]
            },
            {"$set": {"user_uuid": "$uuid"}},
        ]
        pipeline = [elligible_user_query, join_token, auth_filter]
        pipeline.extend(filter)

        db_user = self.user_collection.aggregate(pipeline)
        return [NotificationReceiver(**user) for user in db_user]
