import { useState } from "react";
import Login from './Login';
import Register from './Register';
import { IonCol, IonGrid, IonRow, IonButton } from '@ionic/react';

enum CredentialEnum {
  Login,
  Register
}

const switchEnum = (credentialType, setCredentialType) => {
  if (credentialType === CredentialEnum.Login) {
    setCredentialType(CredentialEnum.Register);
  } else {
    setCredentialType(CredentialEnum.Login);
  }
}

export const CredentialPage: React.FC = () => {
  const [credentialType, SetCredentialType] = useState<CredentialEnum>(CredentialEnum.Login);

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          { credentialType === CredentialEnum.Login ? <Login/> : <Register/> }
          <IonButton expand="full" onClick={() => switchEnum(credentialType, SetCredentialType)}>
            { credentialType === CredentialEnum.Login ? "Register instead" : "Login Instead" }
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
