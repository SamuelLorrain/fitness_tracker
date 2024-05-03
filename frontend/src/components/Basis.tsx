import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { arrowBack } from "ionicons/icons";

const Basis: React.FC = ({name, onReturn = undefined, children}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{name}</IonTitle>
          {
            (onReturn != null) ? (
              <IonButtons slot="start">
                <IonButton onClick={onReturn}>
                  <IonIcon icon={arrowBack}/>
                </IonButton>
              </IonButtons>
            ) : null
          }
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {children}
        <div className="blank-space"></div>
      </IonContent>
    </>
  );
}

export default Basis;
