import { IonApp, IonSpinner, setupIonicReact } from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/custom.css';

import Menu from "./components/Menu";
import CredentialPage from "./pages/CredentialPage"
import { store } from './state/store';
import { Provider, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { PersistenceSingleton } from "./state/persistence";
import { useDispatch } from 'react-redux';
import { initUser, setUserInfos } from "./state/userSlice";
import { useVerifyMutation, useUserInfoMutation } from "./state/api";

setupIonicReact();

const TryLogin: React.FC = () => {
  const isLogged = useSelector((state) => state.user.isLogged);

  return (
    <>
      {
        isLogged ? <Menu/> : <CredentialPage/>
      }
    </>
  );
}

const Initialization: React.FC = ({children}) => {
  const [isInitialized, setIsInitialized] = useState(true);
  const dispatch = useDispatch();
  const [mutateVerify, { isLoading }] = useVerifyMutation();
  const [mutateUserInfo] = useUserInfoMutation();

  useEffect(() => {
    (async function() {
      await PersistenceSingleton().create();
      const token = await PersistenceSingleton().get('user_token');
      const response = await mutateVerify({
        access_token: token
      }).unwrap();
      dispatch(initUser({
        access_token: token
      }))
      const userInfos = await mutateUserInfo().unwrap();
      dispatch(setUserInfos(userInfos))
      setIsInitialized(true);
    })()
  }, [setIsInitialized, setUserInfos, mutateVerify, dispatch, initUser, mutateUserInfo]);


  if (isInitialized) {
    return <>
      {children}
    </>;
  } else {
    return <IonSpinner/>
  }
}


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IonApp>
        <Initialization>
          <TryLogin/>
        </Initialization>
      </IonApp>
    </Provider>
  );
};

export default App;
