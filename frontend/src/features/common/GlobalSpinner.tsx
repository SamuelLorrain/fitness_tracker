import {
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/react";
import './common.css'

const GlobalSpinner = () => {
  return (
    <IonGrid className="globalSpinnerContainer">
      <IonRow>
        <IonCol>
          <IonSpinner className="globalSpinner"/>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default GlobalSpinner;
