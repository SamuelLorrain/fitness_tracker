import { useHistory } from "react-router";
import { useState } from "react";
import Basis from "../components/Basis";
import { useSearchFoodQuery } from "../state/api";

import { IonInput, IonButton, IonButtons } from "@ionic/react";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import { IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";
import { IonIcon } from '@ionic/react';
import { add } from 'ionicons/icons';

const isSearchValid = (search: String): boolean => {
  return search !== '' && search != null;
}

const FoodCard: React.FC = ({ food }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{food.name}</IonCardTitle>
      </IonCardHeader>
    </IonCard>
  );
}

const FoodList: React.FC = ({search}) => {
  const [skip, setSkip] = useState(true);
  const {data = [], isFetching, refetch} = useSearchFoodQuery(search, {skip: skip});

  const onSearch = () => {
    if (skip == true) {
      setSkip(false);
    } else {
      refetch()
    }
  }

  return (
    <>
      <IonButton expand="full" onClick={onSearch} disabled={isFetching || !isSearchValid(search) }>
        Search
      </IonButton>
      <>
      {data?.foods?.map((x) => <FoodCard key={x.uuid} food={x}/>)}
      {
        data?.foods?.length === 0 ? <div>0 foods founds for the given search</div> : null
      }
      </>
    </>
  );
}

const AddEntry: React.FC = () => {
  const [search, setSearch] = useState(null);
  const history = useHistory();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push('/add-food')}>
              <IonIcon icon={add}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput label="search food"
                  value={search}
                  onIonChange={(e) => setSearch(e.target.value)}>
        </IonInput>
        <FoodList search={search}/>
      </IonContent>
    </>
  );
}


export default AddEntry;
