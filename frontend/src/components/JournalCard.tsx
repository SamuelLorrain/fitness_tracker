import { IonItem } from "@ionic/react";

const formatCard = (entry) => {
  switch (entry.entry_type) {
    case "food":
      return `${entry.payload.food_name} - ${entry.payload.nutrition.serving_size.grams} g`;
    case "water":
      return `Water -  ${entry.payload.grams} g`;
    default:
      return `Calories -  ${entry.payload.kcal} kcal`;
  }
};

const JournalCard = ({ entry }) => {
  return (
    <IonItem>
      <div>{formatCard(entry)}</div>
    </IonItem>
  );
};

export default JournalCard;
