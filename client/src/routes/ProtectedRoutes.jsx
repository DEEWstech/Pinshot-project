import { Navigate, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";

export default function ProtectedRoutes({children, isAuth}) {
  const location = useLocation();
  if (!isAuth) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
    
  }
  return children;
}
ProtectedRoutes.PropTypes = {
    children: PropTypes.node.isRequired,
    isAuth: PropTypes.any,
}
