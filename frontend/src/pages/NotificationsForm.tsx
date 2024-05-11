import { useHistory } from "react-router";
import Basis from "../components/Basis";
import { IonToggle, IonInput, IonButton } from "@ionic/react";

const NotificationsForm: React.FC = () => {
  const history = useHistory();

  return (
    <Basis
      name="Notification Settings"
      onReturn={() => history.push("/settings")}
    >
      <IonInput
        type="number"
        label="Water notification time"
        placeholder="hours"
      />
      <IonToggle enableOnOffLabels={true}>Enable water notifications</IonToggle>
      <IonButton expand="full">Test notification</IonButton>
    </Basis>
  );
};

export default NotificationsForm;
