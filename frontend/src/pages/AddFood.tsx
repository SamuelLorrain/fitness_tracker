import { IonInput, IonButton, IonButtons } from "@ionic/react";
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { IonIcon } from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useHistory } from "react-router";
import FormInput from "../components/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateFoodMutation } from "../state/api";

const createValidFoodRequest = (data) => ({
  name: data.name,
  nutrition: {
    serving_size: {
      name: data.serving_name,
      grams: data.serving_weight
    },
    calories: data.energy,
    carbohydrates: {
      carbs: data.carbs
    },
    lipids: {
      fat: data.fat
    },
    proteins: {
      protein: data.proteins
    }
  }
})

const AddFoodForm: React.FC = () => {
  const [mutateCreateFood, { isLoading }] = useCreateFoodMutation();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      name: "",
      serving_name: "",
      serving_weight: null,
      energy: null,
      carbs: null,
      fat: null,
      proteins: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
          .required("A name must be provided"),
      serving_name: Yup.string()
          .required("A serving name must be provided"),
      serving_weight: Yup.number()
          .typeError('serving weight must be a number')
          .required("A serving weight must be provided"),
      energy: Yup.number()
          .typeError('energy must be a number')
          .required('energy must be provided'),
      carbs: Yup.number()
          .typeError('carbs must be a number')
          .required('carbs must be provided'),
      fat: Yup.number()
          .typeError('fat must be a number')
          .required('fat must be provided'),
      proteins: Yup.number()
          .typeError('proteins must be a number')
          .required('proteins must be provided'),
    }),
    onSubmit: async (data) => {
      const properData = createValidFoodRequest(data);
      await mutateCreateFood(properData).unwrap();
      history.push('/journal/add-entry');
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <IonInput
        className={`${formik.errors.name && 'ion-invalid'} ${formik.touched.name && 'ion-touched'} `}
        label="Name"
        value={formik.values.name}
        errorText={formik.errors.name}
        onIonChange={(e) => formik.setFieldValue('name', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('name', true)}
      />
      <IonInput
        className={`${formik.errors.serving_name && 'ion-invalid'} ${formik.touched.serving_name && 'ion-touched'} `}
        label="Serving Name"
        value={formik.values.serving_name}
        errorText={formik.errors.serving_name}
        onIonChange={(e) => formik.setFieldValue('serving_name', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('serving_name', true)}
      />
      <IonInput
        className={`${formik.errors.serving_weight && 'ion-invalid'} ${formik.touched.serving_weight && 'ion-touched'} `}
        label="Serving Weight"
        step="0.01"
        value={formik.values.serving_weight}
        errorText={formik.errors.serving_weight}
        onIonChange={(e) => formik.setFieldValue('serving_weight', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('serving_weight', true)}
        type="number"
      />
      <IonInput
        label="Energy"
        className={`${formik.errors.energy && 'ion-invalid'} ${formik.touched.energy && 'ion-touched'} `}
        step="0.01"
        value={formik.values.energy}
        errorText={formik.errors.energy}
        onIonChange={(e) => formik.setFieldValue('energy', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('energy', true)}
        type="number"
      />
      <IonInput
        label="Fat"
        step="0.01"
        className={`${formik.errors.fat && 'ion-invalid'} ${formik.touched.fat && 'ion-touched'} `}
        value={formik.values.fat}
        errorText={formik.errors.fat}
        onIonChange={(e) => formik.setFieldValue('fat', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('fat', true)}
        type="number"
      />
      <IonInput
        label="Carbs"
        step="0.01"
        className={`${formik.errors.carbs && 'ion-invalid'} ${formik.touched.carbs && 'ion-touched'} `}
        value={formik.values.carbs}
        errorText={formik.errors.carbs}
        onIonChange={(e) => formik.setFieldValue('carbs', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('carbs', true)}
        type="number"
      />
      <IonInput
        label="Proteins"
        step="0.01"
        className={`${formik.errors.proteins && 'ion-invalid'} ${formik.touched.proteins && 'ion-touched'} `}
        value={formik.values.proteins}
        errorText={formik.errors.proteins}
        onIonChange={(e) => formik.setFieldValue('proteins', e.detail.value)}
        onBlur={(e) => formik.setFieldTouched('proteins', true)}
        type="number"
      />
      <IonButton type="submit" expand="full">
        Add Food
      </IonButton>
    </form>
  );
};

const AddFood: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Food</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <AddFoodForm/>
      </IonContent>
    </>
  );
};

export default AddFood;
