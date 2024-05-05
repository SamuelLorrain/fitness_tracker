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
import AccountInformationForm from "../pages/AccountInformationForm";
import GoalsForm from "../pages/GoalsForm";
import Barcode from "../pages/Barcode";

import { ellipse, square, triangle } from 'ionicons/icons';

const Menu = () => {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/:tab(report)/" component={Report}/>
          <Route exact path="/:tab(journal)/barcode" component={Barcode}/>
          <Route exact path="/:tab(journal)/add-entry" component={AddEntry}/>
          <Route exact path="/:tab(journal)/add-food" component={AddFood}/>
          <Route exact path="/:tab(settings)" component={Settings}/>
          <Route exact path="/:tab(settings)/account" component={AccountInformationForm}/>
          <Route exact path="/:tab(settings)/goals" component={GoalsForm}/>
          <Route exact path="/:tab(journal)/entry-form/:uuid" component={AddEntryForm}/>
          <Route exact path="/:tab(journal)" component={Journal}/>
          <Route exact path="/">
            <Redirect to="/report"/>
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="report" href="/report">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Report</IonLabel>
          </IonTabButton>
          <IonTabButton tab="journal" href="/journal">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Journal</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Settings</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

export default Menu;
