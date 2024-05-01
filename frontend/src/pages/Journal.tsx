import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Basis from "../components/Basis";
import { useListEntryQuery } from "../state/api";
import { IonButton } from "@ionic/react";
import { formatDay } from "../utils/date_utils";

/**
 * YYYY-MM-DD to Date, if the entry is invalid, return invalid date
 */
const parseDayStringToDate = (formattedDay: string): Date  => {
  const year = formattedDay.slice(0,4);
  const month = formattedDay.slice(5,7);
  const day = formattedDay.slice(8,10);
  return new Date(year, month-1, day);
}

const moveDay = (dateString: Date, dayDelta: number): Date => {
  // TODO
}

const useJournal = () => {
  const { day: stringDay } = useParams();
  const history = useHistory();
  const [skip, setSkip] = useState(true);
  const [date, setDate] = useState(stringDay ? parseDayStringToDate(stringDay) : null);
  const { data, error, isLoading } = useListEntryQuery(date ? formatDay(date) : null, { skip });

  useEffect(() => {
    if (date == null) {
      history.push(`/journal/${formatDay(new Date())}`)
    } else {
      setSkip(false);
    }
  }, [date]);

  return {
    date,
    journalPayload: data,
    isLoading
  }
}

const Journal: React.FC = () => {
  const { date, journalPayload, isLoading } = useJournal();
  const history = useHistory();
  // used to trigger the rerender of the entries, weirdly...
  const [entries, setEntries] = useState(journalPayload);

  const gotToAddEntryForm = () => {
    history.push('/add-entry');
  }

  useEffect(() => {
    if (journalPayload != null) {
      setEntries(structuredClone(journalPayload?.entries))
    }
  }, [journalPayload, setEntries, journalPayload && journalPayload?.entries.length]);

  return (
    <Basis name="Journal" key={JSON.stringify(Date.now())}>
      <div className="scrollable">
      {date?.toString()}
      {
        (entries == null || entries.length == 0) ?
          <div>no entries for today !</div>
        : (
            entries.map(entry => {
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
    </Basis>
  );
}

export default Journal;
