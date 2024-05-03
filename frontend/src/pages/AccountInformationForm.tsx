import Basis from "../components/Basis";
import { IonInput, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useSetUserInfoMutation } from "../state/api";
import { setUserInfos } from "../state/userSlice";
import * as Yup from "yup";

type AccountInformations = {
  first_name: String;
  last_name: String;
  email: String;
}

const AccountInformationForm: React.FC = () => {
  const user = useSelector(state => state.user);
  const history = useHistory();
  const dispatch = useDispatch();
  const [mutateSetUserInfo, { isLoading }] = useSetUserInfoMutation();
  const formik = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("A first name must be provided"),
      last_name: Yup.string().required("A last name must be provided"),
      email: Yup.string().email().required("An email is required")
    }),
    onSubmit: async (data) => {
      await mutateSetUserInfo(data).unwrap();
      await dispatch(setUserInfos(data));
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
          className={`${formik.errors.first_name && 'ion-invalid'} ${formik.touched.first_name && 'ion-touched'} `}
          label="First name"
          value={formik.values.first_name}
          errorText={formik.errors.first_name}
          onIonChange={(e) => formik.setFieldValue('first_name', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('first_name', true)}
        />
        <IonInput
          className={`${formik.errors.last_name && 'ion-invalid'} ${formik.touched.last_name && 'ion-touched'} `}
          label="Last name"
          value={formik.values.last_name}
          errorText={formik.errors.last_name}
          onIonChange={(e) => formik.setFieldValue('last_name', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('last_name', true)}
        />
        <IonInput
          className={`${formik.errors.email && 'ion-invalid'} ${formik.touched.last_name && 'ion-touched'} `}
          label="Email"
          value={formik.values.email}
          errorText={formik.errors.email}
          onIonChange={(e) => formik.setFieldValue('email', e.detail.value)}
          onBlur={(e) => formik.setFieldTouched('email', true)}
        />
      <IonButton type="submit" expand="full" disabled={isLoading}>
        Change
      </IonButton>
      </form>
    </Basis>
  );
}

export default AccountInformationForm;
