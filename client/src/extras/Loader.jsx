// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const sizeMap = {
  sm: { outer: "w-8 h-8 sm:w-10 sm:h-10", inner: "w-6 h-6 sm:w-8 sm:h-8", glow: "w-12 h-12 sm:w-14 sm:h-14", border: "border-2" },
  md: { outer: "w-12 h-12 sm:w-14 sm:h-14", inner: "w-9 h-9 sm:w-11 sm:h-11", glow: "w-18 h-18 sm:w-20 sm:h-20", border: "border-3" },
  lg: { outer: "w-16 h-16 sm:w-20 sm:h-20", inner: "w-12 h-12 sm:w-16 sm:h-16", glow: "w-24 h-24 sm:w-28 sm:h-28", border: "border-4" },
};

const Loader = ({ size = "lg", inline = false, className = "" }) => {
  const s = sizeMap[size] || sizeMap.lg;

  const spinner = (
    <motion.div className="relative flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1], borderRadius: ["50%", "45%", "50%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={`${s.outer} ${s.border} border-transparent border-t-blue-400 border-r-blue-500 border-b-blue-500 rounded-full shadow-xl`}
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 0.9, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute ${s.inner} ${s.border} border-transparent border-l-blue-300 border-t-blue-300 rounded-full`}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute ${s.glow} bg-blue-400/20 rounded-full`}
      />
    </motion.div>
  );

  if (inline) {
    return <div className={`flex items-center justify-center ${className}`}>{spinner}</div>;
  }

  return (
    <motion.div
      className={`fixed inset-0 bg-blue-500/30 backdrop-blur-md flex items-center justify-center z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {spinner}
    </motion.div>
  );
};

export default Loader;