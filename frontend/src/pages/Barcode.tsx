import Basis from "../components/Basis";
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { IonButton, IonSpinner } from "@ionic/react";
import { initCameras } from "../state/hardwareSlice";
import { useGetFoodBarcodeMutation } from "../state/api";
import { useDispatch, useSelector } from "react-redux";
import AddEntryForm from "./AddEntryForm";
import { useToast } from "../hooks/useToast";

const SCANNER_IDNAME = "scanner-id-el";
let global_scanner = null;
const getScanner = () => {
  if (global_scanner == null) {
    global_scanner = new Html5Qrcode(SCANNER_IDNAME);
  }
  return global_scanner;
};

const BarcodeScanner: React.FC = ({ setBarcodeValue }) => {
  const cameras = useSelector((state) => state.hardware.cameras);
  const scannerDiv = useRef();
  const [scanner, setScanner] = useState(null);

  const success = async (value, codebarObject) => {
    setBarcodeValue(codebarObject);
    await scanner.stop();
  };

  useEffect(() => {
    if (scannerDiv.current != null && scanner == null) {
      setScanner(getScanner());
      return;
    } else if (scanner?.getState() == Html5QrcodeScannerState.SCANNING) {
      return;
    } else {
      setTimeout(() => {
        scanner.start(cameras[0].id, { fps: 10 }, success, () => undefined);
      }, 500);
    }
    return async () => {
      if (scanner && scanner?.getState() != Html5QrcodeScannerState.STOPPED) {
        try {
          await scanner.stop();
        } catch (e) {
          console.log(e);
        }
      }
    };
  }, [scanner, scannerDiv.current]);

  return (
    <div ref={scannerDiv} id={SCANNER_IDNAME}>
      scanner
    </div>
  );
};

const Barcode: React.FC = () => {
  const history = useHistory();
  const barcodeRef = useRef();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const hasCameraPermission = useSelector(
    (state) => state.hardware.hasCameraPermission
  );
  const [barcodeValue, setBarcodeValue] = useState(null);
  const [mutateFoodBarcode, { isLoadingFoodBarcode }] =
    useGetFoodBarcodeMutation();

  const grantCameraPermission = () => {
    Html5Qrcode.getCameras()
      .then((cameras) => {
        dispatch(initCameras(cameras));
      })
      .catch((err) => {
        toast(err);
      });
  };

  useEffect(() => {
    if (barcodeValue == null) {
      return;
    }
    (async () => {
      try {
        const response = await mutateFoodBarcode({
          text: barcodeValue.result.text,
          format: barcodeValue.result.format.format.toString(),
          formatName: barcodeValue.result.format.formatName,
        }).unwrap();
        // Not the best approach (would prefer type validation)
        // but if there is an uuid, it means we retrieved
        // an existing food and so we can directly enter the thing
        if (response?.uuid) {
          history.push(`/journal/entry-form/${response.uuid}`);
        } else {
          history.push("/journal/add-food", { ...response });
        }
      } catch (e) {
        toast(e);
        history.push("/journal/add-food");
      }
    })();
  }, [barcodeValue]);

  if (barcodeValue == null) {
    return (
      <Basis
        name="Bar Code"
        onReturn={() => history.push("/journal/add-entry")}
      >
        {hasCameraPermission ? (
          <>
          <BarcodeScanner setBarcodeValue={setBarcodeValue} />
          <div>Please scan a barcode</div>
          </>
        ) : (
          <IonButton expand="full" onClick={grantCameraPermission}>
            grant camera permission
          </IonButton>
        )}
      </Basis>
    );
  }

  return (
    <Basis name="Bar Code" onReturn={() => history.push("/journal/add-entry")}>
      <IonSpinner />
    </Basis>
  );
};

export default Barcode;
