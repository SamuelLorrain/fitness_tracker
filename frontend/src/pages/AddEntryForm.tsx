import { useState, useEffect } from "react";
import Basis from "../components/Basis";
import { useParams, useHistory } from "react-router-dom";
import { IonInput, IonButton, IonButtons, IonSelect, IonSelectOption } from "@ionic/react";
import { useGetFoodQuery, useCreateEntryMutation } from "../state/api";
import { formatDay } from "../utils/date_utils";
import { parse } from "date-fns";
import { useSelector } from "react-redux";

type ServingSize = {
  name: String;
  grams: number;
}

class BaseNutrition {
  readonly servingSize: ServingSize;
  readonly calories: number;
  readonly carbohydrates: number;
  readonly lipids: number;
  readonly proteins: number;

  constructor(servingSize: ServingSize, calories: number, carbohydrates: number, lipids: number, proteins: number, name: string) {
    this.name = name;
    this.servingSize = {name: servingSize.name, grams: servingSize.grams};
    this.calories = calories;
    this.carbohydrates = carbohydrates;
    this.lipids = lipids;
    this.proteins = proteins;
  }

  newServingSize(otherServingSize: ServingSize): BaseNutrition {
    return new BaseNutrition(
      { name: otherServingSize.name, grams: otherServingSize.grams } as ServingSize,
      (this.calories * otherServingSize.grams) / this.servingSize.grams,
      (this.carbohydrates * otherServingSize.grams) / this.servingSize.grams,
      (this.lipids * otherServingSize.grams) / this.servingSize.grams,
      (this.proteins * otherServingSize.grams) / this.servingSize.grams,
      this.name
    );
  }

  toValidEntryForm(date: Date, baseFoodUuid) {
    return {
      datetime: date,
      entry_type: "food",
      payload: {
        base_food_uuid: baseFoodUuid,
        food_name: this.name,
        nutrition: {
          serving_size: {
            name: this.servingSize.name,
            grams: this.servingSize.grams,
          },
          calories: this.calories,
          carbohydrates: {
            carbs: this.carbohydrates
          },
          lipids: {
            fat: this.lipids
          },
          proteins: {
            protein: this.proteins
          }
        }
      }
    }
  }
}

const useAddEntryForm = (uuid) => {
  const {data, error, isFetching} = useGetFoodQuery(uuid);
  const [entryMutation] = useCreateEntryMutation();
  const [fetchedNutrition, setFetchedNutrition] = useState<BaseNutrition|null>(null);
  const [currentNutrition, setCurrentNutrition] = useState<BaseNutrition|null>(null);
  const [currentServingSize, setCurrentServingSize] = useState<ServingSize|null>(null);

  useEffect(() => {
    if (data != null && !isFetching) {
      setFetchedNutrition(new BaseNutrition(
        data.nutrition.serving_size as ServingSize,
        data.nutrition.calories,
        data.nutrition.carbohydrates.carbs,
        data.nutrition.lipids.fat,
        data.nutrition.proteins.protein,
        data.name
      ));
      setCurrentServingSize(data.nutrition.serving_size as ServingSize);
    }
  }, [data]);

  const updateServingSize = (e) => {
    setCurrentServingSize({name: "g", grams: e.target.value} as ServingSize)
  }

  useEffect(() => {
    if (fetchedNutrition != null && currentServingSize != null) {
      setCurrentNutrition(fetchedNutrition.newServingSize(currentServingSize));
    }
  }, [fetchedNutrition, currentServingSize]);

  return {
    food: data,
    currentNutrition,
    currentServingSize,
    updateServingSize,
    data,
    error,
    isFetching,
    entryMutation
  }
}

const AddEntryForm: React.FC = () => {
  const { uuid } = useParams();
  const history = useHistory();
  const {
    food,
    currentNutrition,
    currentServingSize,
    updateServingSize,
    data,
    error,
    isFetching,
    entryMutation
  } = useAddEntryForm(uuid);
  const timestamp = useSelector(state => state.user.currentTimestamp);
  const date = parse(String(timestamp), 't', new Date());

  const submitEntry = async () => {
    await entryMutation(currentNutrition.toValidEntryForm(date, uuid)).unwrap();
    history.push('/journal');
  }

  if (isFetching || currentNutrition == null) {
    return (
      <Basis name="Add entry" onReturn={() => history.push('/journal/add-entry')}>
        loading
      </Basis>
    );
  }

  return (
    <Basis name="Add entry" onReturn={() => history.push('/journal/add-entry')}>
      <div>{food.name}</div>
      <div>
        <IonInput
            label="serving grams"
            type="number"
            step="0.01"
            value={currentServingSize.grams}
            onIonInput={updateServingSize}
        />
      </div>
      <div>
        <div>calories : {currentNutrition.calories}</div>
        <div>lipids : {currentNutrition.lipids}</div>
        <div>proteins : {currentNutrition.proteins}</div>
        <div>carbohydrates : {currentNutrition.carbohydrates}</div>
      </div>
      <IonButton expand="full" onClick={submitEntry}>Submit</IonButton>
    </Basis>
  );
}

export default AddEntryForm;
