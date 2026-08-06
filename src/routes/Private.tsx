import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../infrastructure/context/auth";

interface PrivateProps {
  children: React.ReactNode;
}

const Private = ({ children }: PrivateProps): JSX.Element => {
  const { signed } = useContext(AuthContext);

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default Private;
