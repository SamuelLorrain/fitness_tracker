import { useState } from "react";
import { IonInput, IonButton } from "@ionic/react";
import { useCreateEntryMutation } from "../state/api";
import { useHistory } from "react-router";
import { parse } from "date-fns";
import { useSelector } from "react-redux";

type WaterEntry = {
  datetime: Date,
  entry_type: 'water'
  payload: {
    water: number
  }
}

const isEntryValid = (water: number): boolean => water != null && water !== '' && !Number.isNaN(Number.parseFloat(water));

const formatWaterEntry = (datetime: Date, water: number): WaterEntry => {
  return {
    datetime: datetime,
    entry_type: 'water',
    payload: {
      grams: Number(water)
    }
  } as WaterEntry;
}

const AddWaterEntryForm = () => {
  const [water, setWater] = useState<number>(null);
  const [entryMutation, { isLoading }] = useCreateEntryMutation();
  const history = useHistory();
  const timestamp = useSelector(state => state.user.currentTimestamp);
  const date = parse(String(timestamp), 't', new Date());

  const submitWater = async () => {
    await entryMutation(formatWaterEntry(date, water)).unwrap();
    history.push('/journal');
  }

  return (
    <>
      <IonInput
        type="number"
        label="water"
        value={water}
        onIonInput={(e) => setWater(e.target.value)}
      />
      <IonButton expand="full"
        onClick={submitWater}
        disabled={!isEntryValid(water) || isLoading}
      >Submit</IonButton>
    </>
  );
}

export default AddWaterEntryForm;
