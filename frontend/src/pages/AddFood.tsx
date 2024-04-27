import { IonInput, IonButton, IonButtons } from "@ionic/react";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import { IonCard, IonCardHeader, IonCardTitle, IonItem, IonLabel } from "@ionic/react";
import { IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from "react-router";
import { Controller, useForm } from 'react-hook-form';

const FoodForm: React.FC = () => {
}

const AddFood: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Food</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <FoodForm/>
      </IonContent>
    </>
  );
}

export default AddFood;
