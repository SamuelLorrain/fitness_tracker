import Basis from "../components/Basis";
import { IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButton } from "@ionic/react";
import { useSelector } from "react-redux";

const Settings: React.FC = () => {
  const user = useSelector(state => state.user);

  return (
    <Basis name="Settings">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Account informations</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div>{user.first_name}</div>
          <div>{user.last_name}</div>
          <div>{user.email}</div>
        </IonCardContent>
        <IonButton fill="clear" disabled="true">Change</IonButton>
      </IonCard>
    </Basis>
  );
}

export default Settings;
