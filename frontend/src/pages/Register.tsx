import { IonButton, IonInput, IonInputPasswordToggle } from "@ionic/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRegisterMutation } from "../state/api";
import { useHistory } from "react-router";
import { useToast } from "../hooks/useToast";

const Register: React.FC = () => {
  const [mutateRegister, { isLoading }] = useRegisterMutation();
  const history = useHistory();
  const { toast } = useToast();
  const formik = useFormik({
    initialValues: {
      first_name: null,
      last_name: null,
      email: null,
      password: null,
      confirm_password: null,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("A first name must be provided"),
      last_name: Yup.string().required("A last name must be provided"),
      email: Yup.string().email().required("An email is required"),
      password: Yup.string().required("A password must be provided"),
      confirm_password: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Must match password",
      ),
    }),
    onSubmit: async (data) => {
      try {
        const response = await mutateRegister(data).unwrap();
        window.location.reload();
      } catch (e) {
        toast(e);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <IonInput
          className={`${formik.errors.first_name && "ion-invalid"} ${formik.touched.first_name && "ion-touched"} `}
          label="First Name"
          value={formik.values.first_name}
          errorText={formik.errors.first_name}
          onIonChange={(e) =>
            formik.setFieldValue("first_name", e.detail.value)
          }
          onBlur={(e) => formik.setFieldTouched("first_name", true)}
        />
        <IonInput
          className={`${formik.errors.last_name && "ion-invalid"} ${formik.touched.last_name && "ion-touched"} `}
          label="Last Name"
          value={formik.values.last_name}
          errorText={formik.errors.last_name}
          onIonChange={(e) => formik.setFieldValue("last_name", e.detail.value)}
          onBlur={(e) => formik.setFieldTouched("last_name", true)}
        />
        <IonInput
          className={`${formik.errors.email && "ion-invalid"} ${formik.touched.email && "ion-touched"} `}
          label="Email"
          value={formik.values.email}
          errorText={formik.errors.email}
          onIonChange={(e) => formik.setFieldValue("email", e.detail.value)}
          onBlur={(e) => formik.setFieldTouched("email", true)}
        />
        <IonInput
          type="password"
          className={`${formik.errors.password && "ion-invalid"} ${formik.touched.password && "ion-touched"} `}
          label="Password"
          value={formik.values.password}
          errorText={formik.errors.password}
          onIonChange={(e) => formik.setFieldValue("password", e.detail.value)}
          onBlur={(e) => formik.setFieldTouched("password", true)}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonInput
          type="password"
          className={`${formik.errors.confirm_password && "ion-invalid"} ${formik.touched.confirm_password && "ion-touched"} `}
          label="confirm_password"
          value={formik.values.confirm_password}
          errorText={formik.errors.confirm_password}
          onIonChange={(e) =>
            formik.setFieldValue("confirm_password", e.detail.value)
          }
          onBlur={(e) => formik.setFieldTouched("confirm_password", true)}
        >
          <IonInputPasswordToggle slot="end" />
        </IonInput>
        <IonButton type="submit" expand="full" disable={isLoading}>
          Create account
        </IonButton>
      </form>
    </>
  );
};

export default Register;
