import { useState } from "react";
import { IonContent } from "@ionic/react";
import Login from "./Login";
// import Register from "./Register";

const CredentialPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <IonContent className="ion-padding">
      {
        isLogin ? <Login/> : <Register/>
      }
    </IonContent>
  );
}

export default CredentialPage;
