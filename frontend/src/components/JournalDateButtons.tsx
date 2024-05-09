import { useState } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { IonModal, IonDatetime, IonDatetimeButton } from "@ionic/react";
import { chevronBack, chevronForward } from "ionicons/icons";
import { add, format, parse, getUnixTime } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setTimestamp } from "../state/userSlice";

const useDate = () => {
  const dispatch = useDispatch();
  const timestamp = useSelector(state => state.user.currentTimestamp);
  const date = parse(String(timestamp), 't', new Date());

  const moveForward = () => {
    dispatch(setTimestamp({timestamp: getUnixTime(add(date, {days: 1}))}));
  }
  const moveBackward = () => {
    dispatch(setTimestamp({timestamp: getUnixTime(add(date, {days: -1}))}));
  }

  const changeDate = (date: Date) => {
    dispatch(setTimestamp({timestamp: getUnixTime(date)}));
  }

  return {
    date,
    moveForward,
    moveBackward,
    changeDate
  }
}

const JournalDateButtons: React.FC = () => {
  const [newDate, setNewDate] = useState(null);

  const {
    date,
    moveForward,
    moveBackward,
    openDateModal,
    changeDate
  } = useDate();

  const tryChangeDate = () => {
    if (newDate != null && date !== newDate) {
      changeDate(newDate);
      setNewDate(null);
    }
  }

  return (
    <>
      <IonButton onClick={moveBackward}>
        <IonIcon icon={chevronBack}></IonIcon>
      </IonButton>
      <IonDatetimeButton presentation="date" datetime="journal-datetime-modal"/>
      <IonButton onClick={moveForward}>
        <IonIcon icon={chevronForward}></IonIcon>
      </IonButton>
      <IonModal keepContentsMounted={true}>
        <IonDatetime
          id="journal-datetime-modal"
          presentation="date"
          value={format(newDate ?? date, 'yyyy-MM-dd')}
          locale="en-US"
          formatOptions={{
           date: {
             weekday: 'short',
             month: 'short',
             day: '2-digit',
           }
          }}
          highlightedDates={[
            {
              date: format(new Date(), 'yyy-MM-dd'),
              textColor: 'var(--ion-color-secondary-contrast)',
              backgroundColor: 'var(--ion-color-secondary)',
            }
          ]}
          onIonBlur={tryChangeDate}
          onIonChange={(e) => setNewDate(e.detail.value)}
        />
      </IonModal>
    </>
  );
}

export default JournalDateButtons;
