import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Basis from "../components/Basis";
import { useListEntryQuery } from "../state/api";
import { IonButton, IonHeader, IonContent, IonToolbar, IonTitle, IonButtons, IonIcon } from "@ionic/react";
import { formatDay } from "../utils/date_utils";
import { add, format, parse, getUnixTime } from "date-fns";
import { chevronBack, chevronForward } from "ionicons/icons";
import { useSelector, useDispatch } from "react-redux";
import { setTimestamp } from "../state/userSlice";

/**
 * YYYY-MM-DD to Date, if the entry is invalid, return invalid date
 */
const parseDayStringToDate = (formattedDay: string): Date  => {
  const year = formattedDay.slice(0,4);
  const month = formattedDay.slice(5,7);
  const day = formattedDay.slice(8,10);
  return new Date(year, month-1, day);
}

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

const Journal: React.FC = () => {
  const history = useHistory();
  const { date, entries, isLoading, moveForward, moveBackward } = useJournal();

  const gotToAddEntryForm = () => {
    history.push('/add-entry');
  }

  console.log("entries", entries);

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
