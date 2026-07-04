import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user, verifyEmail, loading } = useSelector((state) => state.auth);
  const storedVerifyEmail = localStorage.getItem("verifyEmail") === "true";
  const effectiveVerifyEmail = verifyEmail ?? storedVerifyEmail ?? user?.verifyEmail ?? false;
  const hasExistingUser = Boolean(user);

  // Allow the route to render from the already stored user data while a refresh
  // request is still in flight. This prevents account pages from getting stuck on
  // a generic loading screen when the profile request is slow or temporarily fails.
  if (loading && !hasExistingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader fullScreen={false} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!effectiveVerifyEmail) {
    return <Navigate to="/verify-email" replace />;
  }

  if (isAdmin === true && !(user?.role === "ADMIN" || user?.role === "MANAGER")) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAdmin: PropTypes.bool,
};

export default ProtectedRoute;
