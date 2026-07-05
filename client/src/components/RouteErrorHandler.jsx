import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class RouteErrorHandler extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error("Route error:", error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load this page
          </h2>
          <p className="text-sm text-gray-600 mb-4 max-w-md">
            An error occurred while rendering this page. Please try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorHandler;
