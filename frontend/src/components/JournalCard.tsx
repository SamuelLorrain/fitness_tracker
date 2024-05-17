import { IonActionSheet, IonItem } from "@ionic/react";
import { useState } from "react";
import { useDeleteEntryMutation } from "../state/api";
import { useToast } from "../hooks/useToast";
import { useSelector } from "react-redux";
import { format, parse } from "date-fns";

const formatCard = (entry) => {
  switch (entry.entry_type) {
    case "food":
      return `${entry.payload.food_name} - ${entry.payload.nutrition.serving_size.grams} g`;
    case "water":
      return `Water -  ${entry.payload.grams} g`;
    case "weight":
      return `Weight -  ${entry.payload.kilo_grams} kg`;
    default:
      return `Calories -  ${entry.payload.kcal} kcal`;
  }
};

const JournalCard = ({ entry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteMutate, { isLoading, error }] = useDeleteEntryMutation();
  const { messageToast } = useToast();
  const timestamp = useSelector((state) => state.user.currentTimestamp);
  const date = parse(String(timestamp), "t", new Date());

  return (
    <IonItem onClick={() => setIsOpen(true)}>
      <div>{formatCard(entry)}</div>
      <IonActionSheet
        isOpen={isOpen}
        header={`Do you want to delete the entry ? "${formatCard(entry)}"`}
        buttons={[
          {
            text: "Delete",
            role: "destructive",
            data: {
              action: "delete",
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            data: {
              action: "cancel",
            },
          },
        ]}
        onDidDismiss={async (e) => {
          if (e.detail.role === "destructive") {
            try {
              await deleteMutate({
                date: format(date, "yyyy-MM-dd"),
                uuid: entry.uuid,
              });
              messageToast("Entry successfully deleted");
            } catch {
              messageToast("Error while deleting the entry");
            }
          }
          setIsOpen(false);
        }}
      ></IonActionSheet>
    </IonItem>
  );
};

export default JournalCard;
