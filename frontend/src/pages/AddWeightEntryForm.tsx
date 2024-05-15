import { useState } from "react";
import { IonInput, IonButton } from "@ionic/react";
import { useCreateEntryMutation } from "../state/api";
import { useHistory } from "react-router";
import { parse } from "date-fns";
import { useSelector } from "react-redux";

type WeightEntry = {
  datetime: Date;
  entry_type: "weight";
  payload: {
    kilo_grams: number;
  };
};

const isEntryValid = (weight: number | string): boolean =>
  weight != null && weight !== "" && !Number.isNaN(Number.parseFloat(weight));

const formatWeightEntry = (datetime: Date, weight: number): WeightEntry => {
  return {
    datetime: datetime,
    entry_type: "weight",
    payload: {
      kilo_grams: Number(weight),
    },
  } as WeightEntry;
};

const AddWeightEntryForm: React.FC = () => {
  const [weight, setweight] = useState<string | number | null>(null);
  const [entryMutation, { isLoading }] = useCreateEntryMutation();
  const history = useHistory();
  const timestamp = useSelector((state) => state.user.currentTimestamp);
  const date = parse(String(timestamp), "t", new Date());

  const submitWeight = async () => {
    await entryMutation(formatWeightEntry(date, weight)).unwrap();
    history.push("/journal");
  };

  return (
    <>
      <IonInput
        type="number"
        label="weight"
        value={weight}
        onIonInput={(e) => setweight(e.target.value)}
      />
      <IonButton
        expand="full"
        onClick={submitWeight}
        disabled={!isEntryValid(weight) || isLoading}
      >
        Submit
      </IonButton>
    </>
  );
};

export default AddWeightEntryForm;
