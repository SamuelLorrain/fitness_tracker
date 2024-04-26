import { useState } from 'react';
import { IonCol, IonGrid, IonRow, IonInput, IonButton, IonInputPasswordToggle } from '@ionic/react';
import { setUserFromJwt } from '../userSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from "../../../app/services/api";
import type { LoginRequest } from "../../../app/services/api";

// TODO validation
const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [login,{ isLoading, isError }] = useLoginMutation();

  return (
    <>
      <IonInput label="email" value={formState.username} onIonChange={
        (e) => {
          return setFormState((x) => ({
            username: e.target.value,
            password: x.password
          }))
        }
      }
      >
      </IonInput>
      <IonInput type="password" label="Password" value={formState.password} onIonChange={
        (e) => {
          setFormState((x) => ({
            username: x.username,
            password: e.target.value
          }))
        }
      }>
        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
      </IonInput>
      <IonButton expand="full" onClick={async () => {
        try {
          const response = await login(formState).unwrap()
          dispatch(setUserFromJwt(response));
        } catch (error) {
          // TODO display error
          console.error(error);
        }
      }} disabled={isLoading}>
        Login
      </IonButton>
    </>
  );
}

export default Login;
