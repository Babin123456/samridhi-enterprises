import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.props.navigate("/", { replace: true });
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 text-center">
          <div className="w-full max-w-lg rounded-lg border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60 sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              An unexpected error occurred in the application. Please try reloading the page or go back to the homepage.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  navigate: PropTypes.func.isRequired,
};

function ErrorBoundaryWithNavigation({ children }) {
  const navigate = useNavigate();

  return <ErrorBoundary navigate={navigate}>{children}</ErrorBoundary>;
}

ErrorBoundaryWithNavigation.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundaryWithNavigation;
