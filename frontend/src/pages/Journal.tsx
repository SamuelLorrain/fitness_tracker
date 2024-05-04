import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Basis from "../components/Basis";
import { useListEntryQuery } from "../state/api";
import { IonButton, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonIcon } from "@ionic/react";
import { IonCard, IonCardContent, IonProgressBar } from "@ionic/react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { formatDay } from "../utils/date_utils";
import { add, format, parse, getUnixTime } from "date-fns";
import { chevronBack, chevronForward } from "ionicons/icons";
import { useSelector, useDispatch } from "react-redux";
import { setTimestamp } from "../state/userSlice";
import { safeDiv } from "../utils/math_utils";

const useJournal = () => {
  const dispatch = useDispatch();
  const timestamp = useSelector(state => state.user.currentTimestamp);
  const date = parse(String(timestamp), 't', new Date());
  const { data, error, isLoading } = useListEntryQuery(formatDay(date));
  const [entries, setEntries] = useState(data?.entries); // used to trigger the rerender of the entries

  const moveForward = () => {
    dispatch(setTimestamp({timestamp: getUnixTime(add(date, {days: 1}))}));
  }
  const moveBackward = () => {
    dispatch(setTimestamp({timestamp: getUnixTime(add(date, {days: -1}))}));
  }

  useEffect(() => {
    if (data != null) {
      setEntries(structuredClone(data?.entries))
    }
  }, [data, setEntries, data && data?.entries.length]);

  return {
    moveForward,
    moveBackward,
    date,
    isLoading,
    entries
  }
}

const useDailyProgress = () => {
  const caloriesGoal = useSelector(state => state.user?.nutrition_goals_per_day?.calories);
  const proteinsGoal = useSelector(state => state.user?.nutrition_goals_per_day?.proteins.protein);
  const lipidsGoal = useSelector(state => state.user?.nutrition_goals_per_day?.lipids.fat);
  const carbsGoal = useSelector(state => state.user?.nutrition_goals_per_day?.carbohydrates.carbs);

  const hasCaloriesGoal = (caloriesGoal != null);
  const hasProteinsGoal = (proteinsGoal != null);
  const hasLipidsGoal = (lipidsGoal != null);
  const hasCarbsGoal = (carbsGoal != null);
  const hasGoals = hasCaloriesGoal || hasProteinsGoal || hasProteinsGoal || hasCarbsGoal;

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
  }
}

type DailyProgressParam = {
  todayCalories: number,
  todayProteins: number,
  todayLipids: number,
  todayCarbs: number
};

const DailyProgress: React.FC = ({ todayCalories, todayProteins, todayLipids, todayCarbs }: DailyProgressParam) => {
  const {
    hasGoals,
    hasCaloriesGoal,
    hasProteinsGoal,
    hasLipidsGoal,
    hasCarbsGoal,
    caloriesGoal,
    proteinsGoal,
    lipidsGoal,
    carbsGoal
  } = useDailyProgress();
  const caloriesRelation = todayCalories != null ? safeDiv(todayCalories, caloriesGoal) : 0;
  const proteinsRelation = todayProteins != null ? safeDiv(todayProteins, proteinsGoal) : 0;
  const lipidsRelation = todayLipids != null ? safeDiv(todayLipids, lipidsGoal): 0;
  const carbsRelation = todayCarbs != null ? safeDiv(todayCarbs, carbsGoal) : 0;

  if (hasGoals === false) {
    return <></>;
  }

  return (
    <IonCard>
      <IonCardContent>
        <IonGrid>
          {
            hasCaloriesGoal ? (
              <IonRow>
                  <div className="margin-left-auto">{todayCalories ?? 0} kcal / {caloriesGoal} kcal</div>
                  <IonProgressBar value={caloriesRelation}/>
              </IonRow>
            )
            : null
          }
          {
            hasProteinsGoal ? (
              <IonRow>
                  <div className="margin-left-auto">{todayProteins ?? 0} g / {proteinsGoal} g</div>
                  <IonProgressBar value={proteinsRelation}/>
              </IonRow>
            )
            : null
          }
          {
            hasLipidsGoal ? (
              <IonRow>
                  <div className="margin-left-auto">{todayLipids ?? 0} g / {lipidssGoal} g</div>
                  <IonProgressBar value={lipidsRelation}/>
              </IonRow>
            )
            : null
          }
          {
            hasCarbsGoal ? (
              <IonRow>
                  <div className="margin-left-auto">{todayCarbs ?? 0} g / {carbsGoal} g</div>
                  <IonProgressBar value={carbsRelation}/>
              </IonRow>
            )
            : null
          }
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
}

const Journal: React.FC = () => {
  const history = useHistory();
  const { date, entries, isLoading, moveForward, moveBackward } = useJournal();

  const gotToAddEntryForm = () => {
    history.push('/journal/add-entry');
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Journal
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={moveBackward}>
              <IonIcon icon={chevronBack}></IonIcon>
            </IonButton>
            {date ? format(date, 'yyy MMM dd') : null}
            <IonButton onClick={moveForward}>
              <IonIcon icon={chevronForward}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="scrollable">
        <DailyProgress/>
        {
          (entries == null || entries.length == 0) ?
            <div>no entries for today !</div>
          : (
              entries?.map(entry => {
                return (
                  <div key={entry.uuid}>
                    <div>{entry?.payload?.food_name}
                      -
                    {entry?.payload?.nutrition.serving_size.grams} g</div>
                  </div>
                );
            })
          )
        }
        <IonButton expand="full" onClick={gotToAddEntryForm}>Add Entry</IonButton>
        </div>
        <div className="blank-space"> </div>
      </IonContent>
    </>
  );
}

export default Journal;
