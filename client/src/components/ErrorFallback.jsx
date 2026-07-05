import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load this section
      </h2>
      <p className="text-sm text-gray-600 mb-4 max-w-md">
        Something went wrong while rendering this part of the page. 
        {process.env.NODE_ENV === "development" && error && (
          <span className="block mt-1 text-xs text-red-500 font-mono">{error.message}</span>
        )}
      </p>
      {resetErrorBoundary && (
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
