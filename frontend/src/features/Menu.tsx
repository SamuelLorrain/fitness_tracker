import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonRouterOutlet } from '@ionic/react';
import { addCircle, home, settings } from 'ionicons/icons';
import { Redirect, Route } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';

function Menu() {
  return (
    <>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
            </Route>
            <Route exact path="/add">
            </Route>
            <Route path="/settings">
            </Route>
            <Route exact path="/">
              <Redirect to="/home"/>
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="a">
              <IonIcon icon={home}/>
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="b">
              <IonIcon icon={addCircle}/>
              <IonLabel>Add</IonLabel>
            </IonTabButton>
            <IonTabButton tab="c">
              <IonIcon icon={settings}/>
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </>
  );
}
export default Menu;
