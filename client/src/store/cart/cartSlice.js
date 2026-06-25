import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api";

const API_URL = "/api/cart";

// Helper functions for guest cart
const getGuestCart = () => {
  try {
    const cart = localStorage.getItem("guest_cart");
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  } catch (e) {
    return { items: [], total: 0 };
  }
};

const saveGuestCart = (cart) => {
  localStorage.setItem("guest_cart", JSON.stringify(cart));
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ partId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // Guest mode - fetch part details from API to construct cart item
        const guestCart = getGuestCart();
        const existingItemIndex = guestCart.items.findIndex(
          (item) => (item.part?._id || item.part) === partId
        );
        let partData;
        if (existingItemIndex >= 0) {
          const item = guestCart.items[existingItemIndex];
          partData = item.part;
          item.quantity += quantity;
          item.price = partData.price * item.quantity;
        } else {
          const partRes = await axiosInstance.get(`/api/parts/${partId}`);
          partData = partRes.data.part;
          guestCart.items.push({
            part: partData,
            quantity,
            price: partData.price * quantity,
            name: partData.name,
          });
        }
        guestCart.total = guestCart.items.reduce((sum, item) => sum + item.price, 0);
        saveGuestCart(guestCart);
        return guestCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance.post(
        `${API_URL}`,
        { partId, quantity },
        config
      );
      console.log("addToCart response:", response.data);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { success: true, warnings: [], cart: getGuestCart() };
      }

      // Check if there are items in guest cart that need to be synced
      const guestCart = getGuestCart();
      if (guestCart.items && guestCart.items.length > 0) {
        for (const item of guestCart.items) {
          const partId = item.part?._id || item.part;
          const quantity = item.quantity;
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            await axiosInstance.post(`${API_URL}`, { partId, quantity }, config);
          } catch (e) {
            console.error("Failed to sync guest cart item:", partId, e);
          }
        }
        localStorage.removeItem("guest_cart");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance.get(`${API_URL}`, config);
      console.log("fetchCart response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ partId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = getGuestCart();
        const itemIndex = guestCart.items.findIndex(
          (item) => (item.part?._id || item.part) === partId
        );
        if (itemIndex >= 0) {
          const partData = guestCart.items[itemIndex].part;
          guestCart.items[itemIndex].quantity = quantity;
          guestCart.items[itemIndex].price = partData.price * quantity;
          guestCart.total = guestCart.items.reduce((sum, item) => sum + item.price, 0);
          saveGuestCart(guestCart);
        }
        return guestCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance.put(
        `${API_URL}/${partId}`,
        { quantity },
        config
      );
      console.log("updateCartItem response:", response.data);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (partId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = getGuestCart();
        guestCart.items = guestCart.items.filter(
          (item) => (item.part?._id || item.part) !== partId
        );
        guestCart.total = guestCart.items.reduce((sum, item) => sum + item.price, 0);
        saveGuestCart(guestCart);
        return guestCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance.delete(
        `${API_URL}/${partId}`,
        config
      );
      console.log("removeFromCart response:", response.data);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const guestCart = { items: [], total: 0 };
        saveGuestCart(guestCart);
        return guestCart;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axiosInstance.delete(`${API_URL}/clear`, config);
      console.log("clearCart response:", response.data);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { items: [], total: 0 },
    warnings: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearWarnings: (state) => {
      state.warnings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
        state.warnings = [];
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
        state.warnings = action.payload.warnings || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
        state.warnings = [];
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
        state.warnings = [];
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
        state.warnings = [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearWarnings } = cartSlice.actions;
export default cartSlice.reducer;
