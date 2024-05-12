import { useHistory } from "react-router";
import { useState } from "react";
import Basis from "../components/Basis";
import { useSearchFoodMutation } from "../state/api";

import { IonInput, IonButton, IonButtons } from "@ionic/react";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import { IonCard, IonCardHeader, IonCardTitle } from "@ionic/react";
import { IonIcon } from "@ionic/react";
import { IonRippleEffect } from "@ionic/react";
import { add, barcodeOutline, arrowBack } from "ionicons/icons";
import { IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import AddWaterEntryForm from "./AddWaterEntryForm";
import AddCaloriesEntryForm from "./AddCaloriesEntryForm";

enum EntryType {
  food = "food",
  water = "water",
  calories = "calories",
}

const isSearchValid = (search: String): boolean => {
  return search !== "" && search != null;
};

const FoodCard: React.FC = ({ food }) => {
  const history = useHistory();

  const clickOnFood = () => {
    history.push(`/journal/entry-form/${food.uuid}`);
  };

  return (
    <div>
      <IonCard
        onClick={clickOnFood}
        className="clickable ion-activatable ripple-parent"
      >
        <IonRippleEffect></IonRippleEffect>
        <IonCardHeader>
          <IonCardTitle>{food.name}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </div>
  );
};

const FoodList: React.FC = ({ search }) => {
  const [skip, setSkip] = useState(true);
  const [data, setData] = useState([]);
  const [mutateSearchFood, { isLoading }] = useSearchFoodMutation();

  const onSearch = async () => {
    if (!isSearchValid(search)) {
      return;
    }
    const response = await mutateSearchFood(search).unwrap();
    setData(response);
  };

  return (
    <>
      <IonButton
        expand="full"
        onClick={onSearch}
        disabled={isLoading || !isSearchValid(search)}
      >
        Search
      </IonButton>
      <>
        {data?.foods?.map((x) => (
          <FoodCard key={x.uuid} food={x} />
        ))}
        {data?.foods?.length === 0 ? (
          <div>0 foods founds for the given search</div>
        ) : null}
      </>
    </>
  );
};

const AddEntry: React.FC = () => {
  const [search, setSearch] = useState(null);
  const [entryType, setEntryType] = useState(EntryType.food);
  const history = useHistory();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push("/journal")}>
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Add</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/journal/barcode")}>
              <IonIcon icon={barcodeOutline} />
            </IonButton>
            <IonButton onClick={() => history.push("/journal/add-food")}>
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSegment
          value={entryType}
          onIonChange={(e) => setEntryType(e.target.value)}
        >
          <IonSegmentButton value={EntryType.food}>
            <IonLabel>Food</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={EntryType.water}>
            <IonLabel>Water</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value={EntryType.calories}>
            <IonLabel>Calories</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {entryType === EntryType.food ? (
          <>
            <IonInput
              label="search food"
              value={search}
              onIonInput={(e) => setSearch(e.target.value)}
            ></IonInput>
            <FoodList search={search} />
          </>
        ) : null}
        {entryType === EntryType.water ? <AddWaterEntryForm /> : null}
        {entryType === EntryType.calories ? <AddCaloriesEntryForm /> : null}
      </IonContent>
    </>
  );
};

export default AddEntry;
