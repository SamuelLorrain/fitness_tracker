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
    },
    validationSchema: Yup.object({
      calories: Yup.number()
          .typeError('calories must be a number')
          .required("Calories are required"),
    }),
    onSubmit: async (data) => {
      const formattedData = {
        nutrition_goals_per_day: {
          calories: data.calories
        }
      };
      const new_user_infos = structuredClone(user)
      new_user_infos.nutrition_goals_per_day.calories = data.calories;
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
      <IonButton type="submit" expand="full" disabled={isLoading}>
        Change
      </IonButton>
      </form>
    </Basis>
  );
}

export default GoalsForm;
