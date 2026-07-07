import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, variant }) => {
  const isDanger = variant === "danger";
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="bg-white p-6 sm:p-8 rounded-2xl max-w-lg w-full shadow-2xl transform transition-all border border-gray-200"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title" className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">
              {title}
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">{message}</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {cancelText || "Cancel"}
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg transition-all duration-300 shadow-md text-sm sm:text-base ${
                  isDanger
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {confirmText || "Confirm"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["default", "danger"]),
};

ConfirmationModal.defaultProps = {
  confirmText: "Confirm",
  cancelText: "Cancel",
  variant: "default",
};

export default ConfirmationModal;
