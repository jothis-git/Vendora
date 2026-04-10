import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { isLoggedIn } = useContext(AuthContext); // 🔥 Consume Auth State

  // ✅ Format backend response properly
  const formatCart = (dbCartList) => {
    if (!Array.isArray(dbCartList)) return [];

    return dbCartList.map(dbItem => {
      const prod = dbItem.product || {};

      return {
        ...prod,
        product_id: prod.productId || prod.id || prod.product_id,
        quantity: dbItem.quantity,
        cartItemId: dbItem.id || dbItem.cartItemId || null
      };
    });
  };

  // ✅ SINGLE SOURCE OF TRUTH
  const fetchCart = async () => {
    try {
      const res = await api.get("/api/cart");

      const updatedCart = formatCart(res.data);

      setCart(updatedCart);

      const count = updatedCart.reduce(
        (t, i) => t + (i.quantity || 1),
        0
      );

      setCartCount(count);

    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  };

  // ✅ Load cart on mount and when login state changes
  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]); // 🔥 REACT TO LOGIN CHANGE

  // ✅ ADD
  const addToCart = async (product, quantity = 1) => {
    try {
      await api.post("/api/cart/add", {
        productId: product.product_id,
        quantity
      });

      await fetchCart(); // 🔥 ALWAYS refresh


    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add item");
    }
  };

  // ✅ REMOVE
  const removeFromCart = async (productId) => {
    try {
      console.log("Removing:", productId);

      await api.delete(`/api/cart/remove/${productId}`);

      await fetchCart(); // 🔥 FIXED

      toast.success("Item removed");

    } catch (error) {
      console.error("Remove error:", error?.response || error);

      toast.error(
        error?.response?.data?.message || "Failed to remove item"
      );
    }
  };

  // ✅ UPDATE
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await api.put("/api/cart/update", {
        productId,
        quantity
      });

      await fetchCart(); // 🔥 FIXED

    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update quantity");
    }
  };

  // ✅ CLEAR
  const clearCart = async () => {
    console.log("clearCart() starting...");
    try {
      // We clear local state IMMEDIATELY for better UX
      setCart([]);
      setCartCount(0);

      // Then try to notify the backend (Standard REST is DELETE /api/cart)
      await api.delete("/api/cart");
      console.log("Backend cart cleared successfully");
    } catch (error) {
      console.warn("Backend failed to clear cart (Standard DELETE /api/cart failed):", error.response?.status);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart // optional (for manual refresh)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};