import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { api } from "../state/api";
import { store } from "../state/store";
import { setToken } from "../state/userSlice";

// from : https://capacitorjs.com/docs/guides/push-notifications-firebase
export const setupPushNotifications = () => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === "granted") {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  // On success, we should be able to receive notifications
  PushNotifications.addListener("registration", async (token: Token) => {
    store.dispatch(setToken(token));
    try {
      await store
        .dispatch(
          api.endpoints.updateFirebaseNotificationToken.initiate({
            token: token.value,
          })
        )
        .unwrap();
    } catch (e) {
      console.error(e);
    }
  });

  // Some issue with our setup and push will not work
  PushNotifications.addListener("registrationError", (error: any) => {
    alert("Error on registration: " + JSON.stringify(error));
  });

  // Show us the notification payload if the app is open on our device
  PushNotifications.addListener(
    "pushNotificationReceived",
    (notification: PushNotificationSchema) => {
      alert("Push received: " + JSON.stringify(notification));
    }
  );

  // Method called when tapping on a notification
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification: ActionPerformed) => {
      alert("Push action performed: " + JSON.stringify(notification));
    }
  );
};
