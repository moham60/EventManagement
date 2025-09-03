import { useContext } from "react"
import {  AuthContext} from "../Contexts/AuthContext"
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const { token,user } = useContext(AuthContext);
 if (token && user?.role=="user") {
   return    <Navigate to="/userDashboard" replace  />;
  }
 else if (token && user?.role == "admin") {
    return <Navigate to="/adminDashboard" replace />;
  }
 else {
   return <div>{children}</div>;
  }
 
}
