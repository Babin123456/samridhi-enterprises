import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const RECENTLY_VIEWED_KEY = "recentlyViewed";

const RecentlyViewed = () => {
  const [items, setItems] = useState([]);

  const loadRecentlyViewed = () => {
    try {
      const storedItems = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          setItems(parsedItems);
          return;
        }
      }
      setItems([]);
    } catch (error) {
      console.error("Failed to load recently viewed products", error);
      setItems([]);
    }
  };

  useEffect(() => {
    loadRecentlyViewed();

    const handleRecentlyViewedUpdate = () => {
      loadRecentlyViewed();
    };

    window.addEventListener("recently-viewed-updated", handleRecentlyViewedUpdate);

    return () => {
      window.removeEventListener("recently-viewed-updated", handleRecentlyViewedUpdate);
    };
  }, []);

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
      setItems([]);
      window.dispatchEvent(new Event("recently-viewed-updated"));
    } catch (error) {
      console.error("Failed to clear recently viewed products", error);
    }
  };

  if (!items.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-gray-900">Recently Viewed</h2>
        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="min-w-[220px] max-w-[220px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex-shrink-0"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={item.image || "/images/placeholder.jpg"}
                alt={item.name || "Recently viewed product"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.75rem]">
                {item.name || "Product"}
              </h3>
              <p className="text-blue-600 font-bold">
                ₹{Number(item.price || 0).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentlyViewed;
