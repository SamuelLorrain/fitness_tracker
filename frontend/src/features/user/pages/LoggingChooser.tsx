import { useSelector } from 'react-redux';
import { CredentialPage } from './CredentialPage';
import Menu from "../../Menu";

const LoggingChooser: React.FC = () => {
  const isLogged = useSelector((state) => state.user.isLogged);
  return (
    <>
      {isLogged ? <Menu/> : <CredentialPage/>}
    </>
  );
}

export default LoggingChooser;
