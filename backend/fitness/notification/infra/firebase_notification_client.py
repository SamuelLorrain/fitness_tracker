from firebase_admin import credentials, get_app, initialize_app, messaging

from fitness.commons.settings import Settings
from fitness.notification.domain.notification_client import NotificationClient
from fitness.notification.domain.value_objects import NotificationMessage, Token


class FirebaseNotificationClient(NotificationClient):
    def __init__(self):
        # TODO cache the credential / app ?
        self.credentials = credentials.Certificate(Settings().FIREBASE_TOKEN_FILE)
        try:
            self.app = get_app()
        except ValueError:
            self.app = initialize_app(credential=self.credentials)

    def send_notification(self, message: NotificationMessage, token: Token) -> None:
        firebase_message = messaging.Message(
            notification=messaging.Notification(title=message.title, body=message.text),
            token=token,
        )
        response = messaging.send(firebase_message)
        print(response)
