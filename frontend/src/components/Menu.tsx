import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import AddEntry from "../pages/AddEntry";
import AddEntryForm from "../pages/AddEntryForm";
import AddFood from "../pages/AddFood";
import Report from "../pages/Report";
import Settings from "../pages/Settings";
import Journal from "../pages/Journal";

import { ellipse, square, triangle } from 'ionicons/icons';

const Menu = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/report" component={Report}/>
          <Route exact path="/add-entry" component={AddEntry}/>
          <Route exact path="/add-food" component={AddFood}/>
          <Route exact path="/settings" component={Settings}/>
          <Route exact path="/entry-form/:uuid" component={AddEntryForm}/>
          <Route exact path="/journal" component={Journal}/>
          <Route exact path="/">
            <Redirect to="/report"/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/report">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Report</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/journal">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Journal</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/add-entry">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Add</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/settings">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default Menu;
