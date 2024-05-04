import Basis from "../components/Basis";
import { IonInput, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useSetUserGoalsMutation } from "../state/api";
import { setUserInfos } from "../state/userSlice";
import * as Yup from "yup";

const GoalsForm: React.FC = () => {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [mutateSetUserGoals, { isLoading }] = useSetUserGoalsMutation();
  const formik = useFormik({
    initialValues: {
      calories: user.nutrition_goals_per_day?.calories,
      proteins: user.nutrition_goals_per_day?.proteins.protein,
      lipids: user.nutrition_goals_per_day?.lipids.fat,
      carbs: user.nutrition_goals_per_day?.carbohydrates.carbs,
    },
    validationSchema: Yup.object({
      calories: Yup.number()
          .typeError('calories must be a number')
          .required("Calories are required"),
      proteins: Yup.number()
          .typeError('proteins must be a number')
          .required("Proteins are required"),
      lipids: Yup.number()
          .typeError('lipids must be a number')
          .required("Lipids are required"),
      carbs: Yup.number()
          .typeError('carbs must be a number')
          .required("Carbs are required"),
    }),
    onSubmit: async (data) => {
      const formattedData = {
        nutrition_goals_per_day: {
          calories: data.calories,
          proteins: {
            protein: data.proteins
          },
          lipids: {
            fat: data.lipids
          },
          carbohydrates: {
            carbs: data.carbs
          }
        }
      };
      const new_user_infos = structuredClone(user)
      new_user_infos.nutrition_goals_per_day.calories = data.calories;
      new_user_infos.nutrition_goals_per_day.proteins.protein = data.proteins;
      new_user_infos.nutrition_goals_per_day.lipids.fat = data.lipids;
      new_user_infos.nutrition_goals_per_day.carbohydrates.carbs = data.carbs;
      await mutateSetUserGoals(formattedData).unwrap();
      await dispatch(setUserInfos(new_user_infos));
      history.push('/settings');
    }
  });

  return (
    <Basis
        name="Settings"
        onReturn={() => history.push('/settings')}
    >
      <form onSubmit={formik.handleSubmit}>
        <IonInput
          className={`${formik.errors.calories && 'ion-invalid'} ${formik.touched.calories && 'ion-touched'} `}
          label="calories per day"
          value={formik.values.calories}
          errorText={formik.errors.calories}
          onIonChange={(e) => formik.setFieldValue('calories', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('calories', true)}
        />
        <IonInput
          className={`${formik.errors.proteins && 'ion-invalid'} ${formik.touched.proteins && 'ion-touched'} `}
          label="proteins per day"
          value={formik.values.proteins}
          errorText={formik.errors.proteins}
          onIonChange={(e) => formik.setFieldValue('proteins', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('proteins', true)}
        />
        <IonInput
          className={`${formik.errors.carbs && 'ion-invalid'} ${formik.touched.carbs && 'ion-touched'} `}
          label="carbs per day"
          value={formik.values.carbs}
          errorText={formik.errors.carbs}
          onIonChange={(e) => formik.setFieldValue('carbs', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('carbs', true)}
        />
        <IonInput
          className={`${formik.errors.lipids && 'ion-invalid'} ${formik.touched.lipids && 'ion-touched'} `}
          label="lipids per day"
          value={formik.values.lipids}
          errorText={formik.errors.lipids}
          onIonChange={(e) => formik.setFieldValue('lipids', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('lipids', true)}
        />
      <IonButton type="submit" expand="full" disabled={isLoading}>
        Change
      </IonButton>
      </form>
    </Basis>
  );
}

export default GoalsForm;
