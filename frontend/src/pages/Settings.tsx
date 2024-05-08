import Basis from "../components/Basis";
import { IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonButton } from "@ionic/react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { PersistenceSingleton } from "../state/persistence";

const Settings: React.FC = () => {
  const user = useSelector(state => state.user);
  const history = useHistory();

  const logout = async () => {
    await PersistenceSingleton().clear();
    window.history.replaceState(null,null,'/');
    window.location.reload();
  }

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
            <li>{user.nutrition_goals_per_day?.calories}kcal</li>
            <li>{user.nutrition_goals_per_day?.proteins.protein}g of proteins</li>
            <li>{user.nutrition_goals_per_day?.lipids.fat}g of lipids </li>
            <li>{user.nutrition_goals_per_day?.carbohydrates.carbs}g of carbs </li>
          </ul>
        </IonCardContent>
        <IonButton fill="clear" onClick={() => history.push('/settings/goals')}>Change</IonButton>
      </IonCard>
      <IonButton expand="full" onClick={logout}>Logout</IonButton>
    </Basis>
  );
}

export default Settings;
