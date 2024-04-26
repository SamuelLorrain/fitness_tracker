import React, { useState } from 'react';
import { IonCol, IonGrid, IonRow, IonInput, IonButton, IonInputPasswordToggle } from '@ionic/react';
import { login } from './userSlice';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from "../../../app/services/api";
import type { LoginRequest } from "../../../app/services/api";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState<LoginRequest>({
    grant_type: 'password',
    username: '',
    password: ''
  });
  const [login,{ isLoading, isError }] = useLoginMutation();

  return (
    <>
      <IonInput label="email" value={formState.username} onIonChange={
        (e) => setFormState((x) => ({
          grant_type: 'password',
          username: e.target.value,
          password: x.password
        }))}>
      </IonInput>
      <IonInput type="password" label="Password" value={formState.password} onIonChange={
        (e) => setFormState((x) => ({
          grant_type: 'password',
          username: x.username,
          password: e.target.value
        }))
      }>
        <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
      </IonInput>
      <IonButton expand="full" onClick={async () => {
        try {
          const user = await login(formState).unwrap()
          console.log(user);
        } catch (error) {
          console.error(error);
        }
      }} disabled={isLoading}>
        Register
      </IonButton>
    </>
  );
}

export default Register;
