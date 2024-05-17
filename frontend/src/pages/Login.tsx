import {
  IonButton,
  IonInput,
  IonInputPasswordToggle,
  isPlatform,
} from "@ionic/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useTriggerDebugMutation,
  useUserInfoMutation,
} from "../state/api";
import { initUser, setUserInfos } from "../state/userSlice";
import { PersistenceSingleton } from "../state/persistence";
import { setupPushNotifications } from "../utils/push_notifications_utils";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [mutateLogin, { isLoading }] = useLoginMutation();
  const [mutateUserInfo] = useUserInfoMutation();
  const [mutateDebug, { isLoadingTriggerDebug }] = useTriggerDebugMutation();

  const onLogin = async () => {
    try {
      const user = await mutateLogin({ username: email, password }).unwrap();
      dispatch(initUser(user));
      await PersistenceSingleton().set("user_email", email);
      await PersistenceSingleton().set("user_token", user.access_token);
      const userInfos = await mutateUserInfo().unwrap();
      dispatch(setUserInfos(userInfos));
      if (isPlatform("android")) {
        setupPushNotifications();
      }
    } catch (e) {
      mutateDebug(e);
      console.log("error", JSON.stringify(e));
    }
  };

  return (
    <>
      <IonInput
        label="Email"
        value={email}
        onIonChange={(e) => setEmail(e.target.value)}
      />
      <IonInput
        type="password"
        label="Password"
        value={password}
        onIonChange={(e) => setPassword(e.target.value)}
      >
        <IonInputPasswordToggle slot="end" />
      </IonInput>
      <IonButton expand="full" disabled={isLoading} onClick={onLogin}>
        Login
      </IonButton>
    </>
  );
};

export default Login;
