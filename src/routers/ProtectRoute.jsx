import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const token = true

  const { children } = props;

  if (!token) {
    return <Navigate to={`${router.ADMIN}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
