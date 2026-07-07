import { Package, Inbox, SearchX } from "lucide-react";
import PropTypes from "prop-types";

const icons = { Package, Inbox, SearchX };

const EmptyState = ({ icon = "Inbox", title, message, action }) => {
  const Icon = icons[icon] || Inbox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      {message && (
        <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
          {message}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOf(["Package", "Inbox", "SearchX"]),
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
};

export default EmptyState;
