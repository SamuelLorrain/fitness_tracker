import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useListEntryQuery } from "../state/api";
import {
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonList,
} from "@ionic/react";
import { IonCard, IonCardContent, IonProgressBar } from "@ionic/react";
import { IonGrid, IonRow } from "@ionic/react";
import { formatDay } from "../utils/date_utils";
import { parse } from "date-fns";
import { useSelector } from "react-redux";
import { safeDiv } from "../utils/math_utils";
import JournalCard from "../components/JournalCard";
import JournalDateButtons from "../components/JournalDateButtons";

const useJournal = () => {
  const timestamp = useSelector((state) => state.user.currentTimestamp);
  const date = parse(String(timestamp), "t", new Date());
  const { data, isLoading } = useListEntryQuery(formatDay(date));
  const [entries, setEntries] = useState(null); // used to trigger the rerender of the entries
  const [foodEntries, setFoodEntries] = useState(null);

  useEffect(() => {
    if (data != null) {
      setEntries(structuredClone(data?.entries));
      setFoodEntries(
        structuredClone(data?.entries).filter(
          (entry) => entry.entry_type === "food"
        )
      );
    }
  }, [data, setEntries, data && data?.entries.length]);

  let sumTodayCalories = 0;
  if (entries != null && foodEntries != null) {
    sumTodayCalories = foodEntries.reduce(
      (acc, entry) => acc + entry.payload.nutrition.calories,
      0
    );
    sumTodayCalories += entries.reduce((acc, entry) => {
      if (entry.entry_type != "kcal") {
        return acc;
      }
      return acc + entry.payload.kcal;
    }, 0);
  }

  let sumTodayProteins = 0;
  if (foodEntries != null) {
    sumTodayProteins = foodEntries.reduce(
      (acc, entry) => acc + entry.payload.nutrition.proteins.protein,
      0
    );
  }

  let sumTodayLipids = 0;
  if (foodEntries != null) {
    sumTodayLipids = foodEntries.reduce(
      (acc, entry) => acc + entry.payload.nutrition.lipids.fat,
      0
    );
  }

  let sumTodayCarbs = 0;
  if (foodEntries != null) {
    sumTodayCarbs = foodEntries.reduce(
      (acc, entry) => acc + entry.payload.nutrition.carbohydrates.carbs,
      0
    );
  }

  return {
    isLoading,
    entries,
    sumTodayCalories,
    sumTodayCarbs,
    sumTodayProteins,
    sumTodayLipids,
  };
};

const useDailyProgress = () => {
  const caloriesGoal = useSelector(
    (state) => state.user?.nutrition_goals_per_day?.calories
  );
  const proteinsGoal = useSelector(
    (state) => state.user?.nutrition_goals_per_day?.proteins.protein
  );
  const lipidsGoal = useSelector(
    (state) => state.user?.nutrition_goals_per_day?.lipids.fat
  );
  const carbsGoal = useSelector(
    (state) => state.user?.nutrition_goals_per_day?.carbohydrates.carbs
  );

  const hasCaloriesGoal = caloriesGoal != null;
  const hasProteinsGoal = proteinsGoal != null;
  const hasLipidsGoal = lipidsGoal != null;
  const hasCarbsGoal = carbsGoal != null;
  const hasGoals =
    hasCaloriesGoal || hasProteinsGoal || hasProteinsGoal || hasCarbsGoal;

  return {
    hasGoals,
    hasCaloriesGoal,
    caloriesGoal,
    hasProteinsGoal,
    proteinsGoal,
    hasLipidsGoal,
    lipidsGoal,
    hasCarbsGoal,
    carbsGoal,
  };
};

type DailyProgressParam = {
  todayCalories: number;
  todayProteins: number;
  todayLipids: number;
  todayCarbs: number;
};

const DailyProgress: React.FC<DailyProgressParam> = ({
  todayCalories,
  todayProteins,
  todayLipids,
  todayCarbs,
}) => {
  const {
    hasGoals,
    hasCaloriesGoal,
    hasProteinsGoal,
    hasLipidsGoal,
    hasCarbsGoal,
    caloriesGoal,
    proteinsGoal,
    lipidsGoal,
    carbsGoal,
  } = useDailyProgress();
  const caloriesRelation =
    todayCalories != null ? safeDiv(todayCalories, caloriesGoal) : 0;
  const proteinsRelation =
    todayProteins != null ? safeDiv(todayProteins, proteinsGoal) : 0;
  const lipidsRelation =
    todayLipids != null ? safeDiv(todayLipids, lipidsGoal) : 0;
  const carbsRelation = todayCarbs != null ? safeDiv(todayCarbs, carbsGoal) : 0;

  if (hasGoals === false) {
    return <></>;
  }

  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          {hasCaloriesGoal ? (
            <IonRow>
              <div className="margin-left-auto">
                {todayCalories.toFixed(1) ?? 0} kcal / {caloriesGoal} kcal
              </div>
              <IonProgressBar value={caloriesRelation} />
            </IonRow>
          ) : null}
          {hasProteinsGoal ? (
            <IonRow>
              <div className="margin-left-auto">
                {todayProteins.toFixed(1) ?? 0} g / {proteinsGoal} g
              </div>
              <IonProgressBar value={proteinsRelation} />
            </IonRow>
          ) : null}
          {hasLipidsGoal ? (
            <IonRow>
              <div className="margin-left-auto">
                {todayLipids.toFixed(1) ?? 0} g / {lipidsGoal} g
              </div>
              <IonProgressBar value={lipidsRelation} />
            </IonRow>
          ) : null}
          {hasCarbsGoal ? (
            <IonRow>
              <div className="margin-left-auto">
                {todayCarbs.toFixed(1) ?? 0} g / {carbsGoal} g
              </div>
              <IonProgressBar value={carbsRelation} />
            </IonRow>
          ) : null}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

const Journal: React.FC = () => {
  const history = useHistory();
  const {
    entries,
    sumTodayCalories,
    sumTodayLipids,
    sumTodayProteins,
    sumTodayCarbs,
  } = useJournal();

  const gotToAddEntryForm = () => {
    history.push("/journal/add-entry");
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Journal</IonTitle>
          <IonButtons slot="end">
            <JournalDateButtons />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="scrollable">
          <DailyProgress
            todayCalories={sumTodayCalories}
            todayProteins={sumTodayProteins}
            todayCarbs={sumTodayCarbs}
            todayLipids={sumTodayLipids}
          />
          <IonButton expand="full" onClick={gotToAddEntryForm}>
            Add Entry
          </IonButton>
          {entries == null || entries.length == 0 ? (
            <IonCard>
              <IonCardContent>no entries for today !</IonCardContent>
            </IonCard>
          ) : (
            <IonList>
              {entries?.map((entry) => (
                <JournalCard entry={entry} key={entry.uuid} />
              ))}
            </IonList>
          )}
        </div>
        <div className="blank-space"> </div>
      </IonContent>
    </>
  );
};

export default Journal;
