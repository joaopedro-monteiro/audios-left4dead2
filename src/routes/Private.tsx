import { useContext } from "react";
import { AuthContext } from "../infrastructure/context/auth";
import { Navigate } from "react-router-dom";

interface PrivateProps {
    children: React.ReactNode;
}

const Private = ({children}: PrivateProps) => {
    const { signed } = useContext(AuthContext);

    if(!signed) {
        return <Navigate to="/"/>
    }

    return children;
}

export default Private;