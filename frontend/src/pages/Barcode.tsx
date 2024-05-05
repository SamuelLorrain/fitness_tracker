import Basis from "../components/Basis";
import { useHistory } from "react-router-dom";

const Barcode: React.FC = () => {
  const history = useHistory();

  return (
    <Basis name="Bar Code" onReturn={() => history.push('/journal/add-entry')}>
      bar code
    </Basis>
  );
}

export default Barcode;
