import {
  IonGrid,
  IonCol,
  IonRow,
  IonButton,
  IonInput,
  IonInputPasswordToggle
} from "@ionic/react";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../state/api';
import { initUser } from "../state/userSlice";
import { useHistory } from "react-router-dom";
import { PersistenceSingleton } from "../state/persistence";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [mutateLogin, { isLoading }] = useLoginMutation();

  const onLogin = async () => {
    try {
      const user = await mutateLogin({username: email, password }).unwrap();
      dispatch(initUser(user));
      await PersistenceSingleton().set('user_email', email);
      await PersistenceSingleton().set('user_token', user.access_token);
      window.history.replaceState(null, null, '/');
    } catch (e) {
      console.log("error", e);
    }
  }

  return (
    <IonGrid>
      <IonRow>
        <IonCol>
          <IonInput label="Email"
                    value={email}
                    onIonChange={(e) => setEmail(e.target.value)}
          />
          <IonInput type="password"
                    label="Password"
                    value={password}
                    onIonChange={(e) => setPassword(e.target.value)}
          >
            <IonInputPasswordToggle slot="end"/>
          </IonInput>
          <IonButton expand="full" disabled={isLoading} onClick={onLogin}>
            Login
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

export default Login;