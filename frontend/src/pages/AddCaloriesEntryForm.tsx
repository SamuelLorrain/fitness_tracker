import { useState } from "react";
import { IonInput, IonButton } from "@ionic/react";
import { useCreateEntryMutation } from "../state/api";
import { useHistory } from "react-router";
import { parse } from "date-fns";
import { useSelector } from "react-redux";

type CaloriesEntry = {
  datetime: Date,
  entry_type: 'kcal'
  payload: {
    kcal: number
  }
}

const isEntryValid = (calories: number): boolean => calories != null && calories !== '' && !Number.isNaN(Number.parseFloat(calories));

const formatCaloriesEntry = (datetime: Date, calories: number): CaloriesEntry => {
  return {
    datetime: datetime,
    entry_type: 'kcal',
    payload: {
      kcal: Number(calories)
    }
  } as CaloriesEntry;
}

const AddCaloriesEntryForm = () => {
  const [calories, setCalories] = useState<number>(null);
  const [entryMutation, { isLoading }] = useCreateEntryMutation();
  const history = useHistory();
  const timestamp = useSelector(state => state.user.currentTimestamp);
  const date = parse(String(timestamp), 't', new Date());

  const submitCalories = async () => {
    await entryMutation(formatCaloriesEntry(date, calories)).unwrap();
    history.push('/journal');
  }

  return (
    <>
      <IonInput
        type="number"
        label="calories"
        value={calories}
        onIonInput={(e) => setCalories(e.target.value)}
      />
      <IonButton expand="full"
        onClick={submitCalories}
        disabled={!isEntryValid(calories) || isLoading}
      >Submit</IonButton>
    </>
  );
}

export default AddCaloriesEntryForm;
