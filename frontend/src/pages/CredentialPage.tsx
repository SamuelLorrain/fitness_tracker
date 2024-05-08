import { useState } from "react";
import { IonContent, IonButton, IonGrid, IonCol, IonRow } from "@ionic/react";
import Login from "./Login";
import Register from "./Register";

const CredentialPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <IonContent className="ion-padding">
      <IonGrid>
        <IonRow>
          <IonCol>
            {isLogin ? <Login /> : <Register />}
            <IonButton expand="full" onClick={() => setIsLogin(state => !state)}>
              {isLogin ? "Register instead" : "Login instead"}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default CredentialPage;
