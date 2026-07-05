import React from "react";
import PropTypes from "prop-types";

const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
  </div>
);

const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
        >
          <Shimmer className="w-full h-44" />
          
          <div className="p-3 sm:p-4 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <Shimmer className="h-5 rounded w-2/3" />
              <Shimmer className="h-4 rounded w-16 shrink-0" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Shimmer className="h-3 rounded w-1/4" />
                <Shimmer className="h-4 rounded w-1/3" />
              </div>
              <div className="flex items-center justify-between">
                <Shimmer className="h-6 rounded w-1/4" />
                <Shimmer className="h-5 rounded w-1/5" />
              </div>
              <Shimmer className="h-4 rounded w-1/2" />
              <Shimmer className="h-4 rounded w-2/3" />
            </div>
          </div>

          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <Shimmer className="h-9 rounded-lg w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

ProductSkeleton.propTypes = {
  count: PropTypes.number,
};

export default ProductSkeleton;
