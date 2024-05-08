import { useState, useRef, useEffect } from "react";
import { IonInput, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonSelect, IonSelectOption } from "@ionic/react";
import { IonGrid, IonRow, IonCol } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

enum SexEnum {
  male = "male",
  female = "female"
}

enum ActivityEnum {
  sedentary = "sedentary",
  light = "light",
  moderate = "moderate",
  heavy = "heavy",
  athlete = "athlete"
}

class TDEEData {
  readonly sex: SexEnum;
  readonly activity: ActivityEnum;
  readonly age: number;
  readonly weight: number;
  readonly height: number;
  readonly activityMatrix = {
    [ActivityEnum.sedentary]: 1.2,
    [ActivityEnum.light]: 1.375,
    [ActivityEnum.moderate]: 1.55,
    [ActivityEnum.heavy]: 1.725,
    [ActivityEnum.athlete]: 1.9,
  };

  constructor(sex: SexEnum, age: number, weight: number, height: number, activity: ActivityEnum) {
    this.sex = sex;
    this.age = age;
    this.weight = weight;
    this.height = height;
    this.activity = activity;
  }

  getActivityMultiplier(): number {
    return this.activityMatrix[this.activity];
  }

  getBMR(): number {
    return 10*this.weight + 6.25*this.height - 5*this.age + 5;
  }

  getTDEE(): number {
    return this.getBMR() * this.getActivityMultiplier()
  }

}

const useGoalsIMCModal = (setIsOpen: Function, updater: Function) => {
  const [tdeeData, setTdeeData] = useState(null);
  const tdeeFormik = useFormik({
    initialValues: {
      sex: null,
      age: null,
      weight: null,
      height: null,
      activity: null,
    },
    validationSchema: Yup.object({
      sex: Yup.string().oneOf(["male", "female"]),
      age: Yup.number()
          .typeError('age must be a number')
          .required("Age is required"),
      weight: Yup.number()
          .typeError('weight must be a number')
          .required("Weight is required"),
      height: Yup.number()
          .typeError('height must be a number')
          .required("Height is required"),
      activity: Yup.string().oneOf(["sedentary", "light", "moderate", "heavy", "athlete"])
    }),
    onSubmit: (data) => {
      const tdeeData = new TDEEData(
        data.sex,
        data.age,
        data.weight,
        data.height,
        data.activity
      );
      setTdeeData(tdeeData);
      console.log(tdeeData);
      console.log(tdeeData.getTDEE());
    }
  });

  useEffect(() => {
    tdeeFormik.handleSubmit();
  }, [
      tdeeFormik.values.sex,
      tdeeFormik.values.age,
      tdeeFormik.values.weight,
      tdeeFormik.values.height,
      tdeeFormik.values.activity,
  ]);

  const updateGoals = (calories: number) => {
    const proteins = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.35) / 4);
    const lipids = Math.round((calories * 0.35) / 9);
    updater(calories, proteins, carbs, lipids);
    setIsOpen(false);
  }

  return {
    tdeeFormik,
    tdeeData,
    updateGoals
  }
}

const GoalsIMCModal = ({isOpen, setIsOpen, updater}: {isOpen: boolean, setIsOpen: Function, updater: Function}) => {
  const { tdeeFormik, tdeeData, updateGoals } = useGoalsIMCModal(setIsOpen, updater);

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>TDEE and More</IonTitle>
        </IonToolbar>
      </IonHeader>
        <IonContent className="ion-padding">
        <form onSubmit={tdeeFormik.handleSubmit}>
          <IonSelect
            className={`${tdeeFormik.errors.sex && 'ion-invalid'} ${tdeeFormik.touched.sex && 'ion-touched'} `}
            label="Sex"
            value={tdeeFormik.values.sex}
            errorText={tdeeFormik.errors.sex}
            onIonChange={(e) => tdeeFormik.setFieldValue('sex', e.detail.value)}
            onBlur={(e) => tdeeFormik.setFieldTouched('sex', true)}
          >
            <IonSelectOption value="male">Male</IonSelectOption>
            <IonSelectOption value="female">Female</IonSelectOption>
          </IonSelect>
          <IonInput
            className={`${tdeeFormik.errors.age && 'ion-invalid'} ${tdeeFormik.touched.age && 'ion-touched'} `}
            label="Age"
            type="number"
            value={tdeeFormik.values.age}
            errorText={tdeeFormik.errors.age}
            onIonChange={(e) => tdeeFormik.setFieldValue('age', e.detail.value)}
            onBlur={(e) => tdeeFormik.setFieldTouched('age', true)}
          />
          <IonInput
            className={`${tdeeFormik.errors.weight && 'ion-invalid'} ${tdeeFormik.touched.weight && 'ion-touched'} `}
            label="Weight"
            type="number"
            value={tdeeFormik.values.weight}
            errorText={tdeeFormik.errors.weight}
            onIonChange={(e) => tdeeFormik.setFieldValue('weight', e.detail.value)}
            onBlur={(e) => tdeeFormik.setFieldTouched('weight', true)}
          />
          <IonInput
            className={`${tdeeFormik.errors.height && 'ion-invalid'} ${tdeeFormik.touched.height && 'ion-touched'} `}
            label="Height"
            type="number"
            value={tdeeFormik.values.height}
            errorText={tdeeFormik.errors.height}
            onIonChange={(e) => tdeeFormik.setFieldValue('height', e.detail.value)}
            onBlur={(e) => tdeeFormik.setFieldTouched('height', true)}
          />
          <IonSelect
            className={`${tdeeFormik.errors.activity && 'ion-invalid'} ${tdeeFormik.touched.activity && 'ion-touched'} `}
            label="Activity"
            type="number"
            value={tdeeFormik.values.activity}
            errorText={tdeeFormik.errors.activity}
            onIonChange={(e) => tdeeFormik.setFieldValue('activity', e.detail.value)}
            onBlur={(e) => tdeeFormik.setFieldTouched('activity', true)}
          >
            <IonSelectOption value="sedentary">Sedentary (office job)</IonSelectOption>
            <IonSelectOption value="light">Light Exercice (1-2days/week)</IonSelectOption>
            <IonSelectOption value="moderate">Moderate Exercice (3-5days/week)</IonSelectOption>
            <IonSelectOption value="heavy">Heavy Exercice (6-7days/week)</IonSelectOption>
            <IonSelectOption value="athlete">Athlete (2x per day)</IonSelectOption>
          </IonSelect>
        </form>
        <div className="margin-top-big">
        {
          (tdeeData) ?
          <>
            <div className="margin-bottom-small">TDEE (maintenance) : {tdeeData.getTDEE().toFixed(0)} kcal/day</div>
            <div className="margin-bottom-small">Bulk : {(tdeeData.getTDEE() * 1.1).toFixed(0)} kcal/day</div>
            <div className="margin-bottom-small">Cut : {(tdeeData.getTDEE() * 0.9).toFixed(0)} kcal/day</div>
            <IonButton expand="full" onClick={() => updateGoals(tdeeData.getTDEE().toFixed(0))}>Set goal to maintenance</IonButton>
            <IonButton expand="full" onClick={() => updateGoals((tdeeData.getTDEE() * 1.1).toFixed(0))}>Set goal to bulk</IonButton>
            <IonButton expand="full" onClick={() => updateGoals((tdeeData.getTDEE() * 0.9).toFixed(0))}>Set goal to cut</IonButton>
          </> : null
        }
        </div>
      </IonContent>
    </IonModal>
  );
}

export default GoalsIMCModal;
