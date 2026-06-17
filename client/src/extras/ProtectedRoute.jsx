import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, user, verifyEmail } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!verifyEmail) {
    return <Navigate to="/verify-email" />;
  }

  if (isAdmin === true && !(user?.role === "ADMIN" || user?.role === "MANAGER")) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAdmin: PropTypes.bool,
};

export default ProtectedRoute;
