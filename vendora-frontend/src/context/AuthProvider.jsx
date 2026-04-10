import { useState, useEffect } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    console.log("Verifying session with backend...");
    try {
      const response = await api.get("/api/auth/me");
      if (response && response.data) {
        console.log("Session verified:", response.data.username);
        // Standardize the user object to handle naming variations
        const mappedUser = {
          ...response.data,
          userid: response.data.userid || response.data.userId || response.data.user_id || response.data.id,
          createdAt: response.data.createdAt || response.data.CreatedAt || response.data.created_at || response.data.createdDate,
        };
        setUser(mappedUser);
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(mappedUser));
      } else {
        throw new Error("Invalid session data");
      }
    } catch (error) {
      console.warn("Session verification failed. Clearing local state. Status:", error.response?.status);
      
      // ✅ ABSOLUTELY CLEAR EVERYTHING if the backend check fails for ANY reason
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // We strictly check the backend on every mount/refresh
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", credentials);
      // Backend returns: { message, username, role }
      const userData = {
        ...response.data, // ✅ Capture all fields (email, phone, address, etc.)
        userid: response.data.userid || response.data.userId || response.data.user_id || response.data.id, // ✅ Flexible mapping
      };

      await checkAuth(); // 🔥 FETCH FULL METADATA (email, createdAt, etc.) IMMEDIATELY
      
      return response.data; // Return the full response data including role
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
