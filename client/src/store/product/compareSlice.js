import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "compareList";
const MAX_COMPARE = 4;

// Load the persisted compare list so the selection survives navigation and
// page refreshes. Stores the full (trimmed) part objects so the tray and the
// compare page can render without an extra fetch.
const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be unavailable (private mode / quota) — fail silently; the
    // in-memory Redux state still works for the current session.
  }
};

// Keep only the fields the tray and compare table actually need, so we don't
// bloat localStorage with full image arrays etc.
const trimPart = (part) => ({
  _id: part._id,
  name: part.name,
  product_id: part.product_id,
  price: part.price,
  stock: part.stock,
  category: part.category,
  ratings: part.ratings,
  bestseller: part.bestseller,
  image: part.images?.[0]?.url || "",
});

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: loadFromStorage(),
    max: MAX_COMPARE,
    // Transient UI message (e.g. "limit reached") for the page/tray to surface.
    notice: null,
  },
  reducers: {
    addToCompare: (state, action) => {
      const part = action.payload;
      if (!part || !part._id) return;
      if (state.items.some((p) => p._id === part._id)) return; // already in
      if (state.items.length >= state.max) {
        state.notice = `You can compare up to ${state.max} products at a time`;
        return;
      }
      state.items.push(trimPart(part));
      state.notice = null;
      saveToStorage(state.items);
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload);
      state.notice = null;
      saveToStorage(state.items);
    },
    clearCompare: (state) => {
      state.items = [];
      state.notice = null;
      saveToStorage(state.items);
    },
    clearCompareNotice: (state) => {
      state.notice = null;
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  clearCompareNotice,
} = compareSlice.actions;
export default compareSlice.reducer;
