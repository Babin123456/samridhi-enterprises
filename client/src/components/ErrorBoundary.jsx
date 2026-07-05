import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, ChevronDown, ChevronUp, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (process.env.NODE_ENV === "development") {
      console.group("ErrorBoundary caught an error");
      console.error("Error:", error);
      console.error("Component Stack:", errorInfo?.componentStack);
      console.groupEnd();
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.props.navigate("/", { replace: true });
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;
      const isDev = process.env.NODE_ENV === "development";

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12 text-center">
          <div className="w-full max-w-lg rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-xl sm:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 text-red-500">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Something went wrong
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
              An unexpected error occurred. Please try reloading or go back to the homepage.
            </p>

            {isDev && error && (
              <div className="mt-4 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-expanded={showDetails}
                >
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Error details
                </button>
                {showDetails && (
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs text-red-600 dark:text-red-400 overflow-auto max-h-40 whitespace-pre-wrap break-all">
                    {error.message}
                    {errorInfo?.componentStack && `\n\nComponent Stack:\n${errorInfo.componentStack}`}
                  </pre>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
