import Basis from "../components/Basis";
import { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Html5Qrcode } from "html5-qrcode";
import { IonButton } from "@ionic/react";
import { initCameras } from "../state/hardwareSlice";
import { useDispatch, useSelector } from "react-redux";


const failure = (err) => {};

const BarcodeScanner: React.FC = () => {
  const SCANNER_IDNAME = "scanner-id-el";
  const cameras = useSelector(state => state.hardware.cameras);
  const scannerDiv = useRef();
  const [scanner, setScanner] = useState(null);
  const [scannerStarted, setScannerStarted] = useState(false);

  const success = async (a,b) => {
    await scanner.stop();
  }

  console.log("a");

  if (scannerDiv.current != null && scanner == null) {
    console.log("b");
    setScanner(new Html5Qrcode(SCANNER_IDNAME));
  }

  useEffect(() => {
    console.log("c");
    if (scannerStarted || scanner == null) {
      return;
    } else {
      console.log("d");
      scanner.start(
        cameras[0].id,
        {fps: 10},
        success,
        failure
      );
      setScannerStarted(true);
    }
  }, [scanner, scannerStarted, setScannerStarted]);

  return (
    <div ref={scannerDiv} id={SCANNER_IDNAME}>
      scanner
    </div>
  );
}

const Barcode: React.FC = () => {
  const history = useHistory();
  const barcodeRef = useRef();
  const dispatch = useDispatch();
  const hasCameraPermission = useSelector(state => state.hardware.hasCameraPermission)

  const grantCameraPermission = () => {
    Html5Qrcode.getCameras().then(cameras => {
      dispatch(initCameras(cameras));
    }).catch(
      err => console.log(err)
    );
  }

  return (
    <Basis name="Bar Code" onReturn={() => history.push('/journal/add-entry')}>
      {
        hasCameraPermission ?
        <BarcodeScanner/>
        :
        <IonButton onClick={grantCameraPermission}>
          grant camera permission
        </IonButton>
      }
    </Basis>
  );
}

export default Barcode;
