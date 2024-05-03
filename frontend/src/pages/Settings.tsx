import Basis from "../components/Basis";
import { IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButton } from "@ionic/react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Settings: React.FC = () => {
  const user = useSelector(state => state.user);
  const history = useHistory();

  return (
    <Basis name="Settings">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Account</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div>{user.first_name}</div>
          <div>{user.last_name}</div>
          <div>{user.email}</div>
        </IonCardContent>
        <IonButton
          fill="clear"
          onClick={() => history.push('/settings/account')}
          >
          Change
        </IonButton>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Goals per days</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <ul>
            <li>{user.nutrition_goals_per_day?.calories} kcal</li>
          </ul>
        </IonCardContent>
        <IonButton fill="clear" disabled="true">Change</IonButton>
      </IonCard>
    </Basis>
  );
}

export default Settings;
