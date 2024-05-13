from fitness.commons.singleton import Singleton
from fitness.notification.domain.notification_client import NotificationClient
from fitness.notification.domain.notification_repository import NotificationRepository
from fitness.notification.domain.notification_service import NotificationService
from fitness.notification.infra.firebase_notification_client import (
    FirebaseNotificationClient,
)
from fitness.notification.infra.mongo_db_notification_repository import (
    MongoDbNotificationRepository,
)


class NotificationConfiguration(Singleton):

    @property
    def notification_service(self) -> NotificationService:
        return NotificationService(
            self.notification_repository, self.notification_client
        )

    @property
    def notification_repository(self) -> NotificationRepository:
        return MongoDbNotificationRepository()

    @property
    def notification_client(self) -> NotificationClient:
        return FirebaseNotificationClient()
