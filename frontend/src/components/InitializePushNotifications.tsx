import { useEffect, useState } from "react";
import {
  registerPushNotificationEvents,
  setupPushNotifications,
  unregisterPushNotificationEvents,
} from "../utils/push_notifications_utils";
import { isPlatform, IonAlert } from "@ionic/react";

const InitializePushNotifications: React.FC = ({ children }) => {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [data, setData] = useState({});
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");

  console.log("data", JSON.stringify(data));

  useEffect(() => {
    if (isPlatform("android")) {
      setupPushNotifications();
      registerPushNotificationEvents(setShowNotification, setData);
    }
    return () => {
      if (isPlatform("android")) {
        unregisterPushNotificationEvents();
      }
    };
  }, [setShowNotification, setData]);

  useEffect(() => {
    console.log("data", JSON.stringify(data));
    setTitle(data?.data?.title ?? "");
    setText(data?.data?.body ?? "");
  }, [JSON.stringify(data)]);

  return (
    <>
      <IonAlert
        header={title}
        message={text}
        isOpen={showNotification}
        onDidDismiss={() => setShowNotification(false)}
        buttons={["OK"]}
      />
      {children}
    </>
  );
};

export default InitializePushNotifications;
