import { useIonToast } from "@ionic/react";

const TOAST_POSITION = "bottom";
const TOAST_DURATION = 1500;
const TOAST_DEFAULT_MESSAGE = "An error occurred";

export const useToast = () => {
  const [presentToast] = useIonToast();

  const toast = (e) => {
    presentToast({
      message: `Error ${e?.data?.details ?? TOAST_DEFAULT_MESSAGE}`,
      position: TOAST_POSITION,
      duration: TOAST_DURATION,
    });
  };

  const messageToast = (message: string) => {
    if (message) {
      presentToast({
        message: message,
        position: TOAST_POSITION,
        duration: TOAST_DURATION,
      });
    }
  }

  return {
    toast,
    messageToast
  };
};
