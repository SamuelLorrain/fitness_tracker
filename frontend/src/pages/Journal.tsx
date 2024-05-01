import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Basis from "../components/Basis";
import { useListEntryQuery } from "../state/api";

/**
 * YYYY-MM-DD to Date, if the entry is invalid, return invalid date
 */
const parseDayStringToDate = (formatDay: string): Date  => {
  const year = formatDay.slice(0,4);
  const month = formatDay.slice(5,7);
  const day = formatDay.slice(8,10);
  return new Date(year, month-1, day);
}

const formatDay = (date: Date): string => {
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth()+1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`
}

const moveDay = (dateString: Date, dayDelta: number): Date => {
  // TODO
}

const useJournal = () => {
  const { day: stringDay } = useParams();
  const history = useHistory();
  const [skip, setSkip] = useState(true);
  const [date, setDate] = useState(parseDayStringToDate(stringDay));
  const { data, error, isLoading } = useListEntryQuery(formatDay(date), { skip });

  useEffect(() => {
    if (date == null) {
      history.replace(`/journal/${formatDay(new Date())}`)
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

  return (
    <Basis name="Journal">
      {date.toString()}
      {
        (journalPayload == null || journalPayload?.entries?.length === 0) ?
        <div>no entries for today !</div>
        :
        <div>TODO: display list of entries for the day</div>
      }
    </Basis>
  );
}

export default Journal;
