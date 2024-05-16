import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { api } from "../state/api";
import { store } from "../state/store";
import { setToken } from "../state/userSlice";

const onRegistration = async (token: Token) => {
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
};

const onErrorRegistration = (error: any) => {
  console.log("Error on registration: " + JSON.stringify(error));
};

const onPushRegistrationReceived =
  (setShowNotification, setData) => (notification: PushNotificationSchema) => {
    setData(notification);
    setShowNotification(true);
  };

const onActionPerformed =
  (setShowNotification, setData) => (actionPerformed: ActionPerformed) => {
    setData(actionPerformed.notification);
    setShowNotification(true);
  };

export const setupPushNotifications = () => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === "granted") {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });
};

export const registerPushNotificationEvents = (
  setShowNotification,
  setData
) => {
  PushNotifications.addListener("registration", onRegistration);
  PushNotifications.addListener("registrationError", onErrorRegistration);
  PushNotifications.addListener(
    "pushNotificationReceived",
    onPushRegistrationReceived(setShowNotification, setData)
  );
  PushNotifications.addListener(
    "pushNotificationActionPerformed",
    onActionPerformed(setShowNotification, setData)
  );
};

export const unregisterPushNotificationEvents = () => {
  PushNotifications.removeAllListeners();
};
