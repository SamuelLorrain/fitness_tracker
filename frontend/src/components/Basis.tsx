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
      </IonContent>
    </>
  );
}

export default Basis;
