import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';

const Basis: React.FC = ({name, children}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{name}</IonTitle>
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
