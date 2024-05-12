import { useHistory } from "react-router";
import Basis from "../components/Basis";
import { IonToggle, IonInput, IonButton, IonSpinner } from "@ionic/react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useUpdateWaterNotificationMutation } from "../state/api";
import { useToast } from "../hooks/useToast";

const isValid = (value: string|number) => value != null && value != '' && !Number.isNaN(Number(value))

const NotificationsForm: React.FC = () => {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const [waterValue, setWaterValue] = useState(user.notification_enabled ? user.notification_delta_hours : null);
  const [enabled, setEnabled] = useState(user.notification_enabled);
  const [mutateNotification, { isLoading }] = useUpdateWaterNotificationMutation();
  const { messageToast } = useToast();

  const tryEnableNotifications = async () => {
    try {
      await mutateNotification({
        notification_enabled: !enabled,
        notification_delta_hours: waterValue
      }).unwrap();
      setEnabled((state: boolean) => !state);
    } catch(e) {
      if (enabled) {
        messageToast("Error, unable to disable notifications");
      } else {
        messageToast("Error, unable to enable notifications");
      }
    }
  }

  const testNotification = () => {
    messageToast("You will receive a notification soon");
  }

  return (
    <Basis
      name="Notification Settings"
      onReturn={() => history.push("/settings")}
    >
      <IonInput
        type="number"
        label="Water notification time"
        value={waterValue}
        onIonInput={e => setWaterValue(e.target.value)}
        placeholder="hours"
      />
      <div>
        <IonToggle
          enableOnOffLabels={true}
          disabled={!isValid(waterValue)}
          checked={enabled}
          onIonChange={tryEnableNotifications}>
          Enable water notifications
        </IonToggle>
        {
          isLoading ? <IonSpinner/> : null
        }
      </div>
      <IonButton expand="full" disabled={!enabled} onClick={testNotification}>
        Test notification
      </IonButton>
    </Basis>
  );
};

export default NotificationsForm;
