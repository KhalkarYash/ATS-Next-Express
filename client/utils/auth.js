// Authentication utilities
import { API_BASE_URL, logout as apiLogout } from "./api";

// Token refresh threshold (5 minutes before expiry)
const REFRESH_THRESHOLD = 5 * 60 * 1000;

// Safe localStorage access
const getLocalStorage = (key, defaultValue = null) => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error accessing localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage for key ${key}:`, error);
  }
};

export const getAuthToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
};

export const getUserData = () => {
  return getLocalStorage("userData", null);
};

// Parse JWT token without external library
const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};

// Check if token needs refresh
const shouldRefreshToken = (token) => {
  const decoded = parseJwt(token);
  if (!decoded) return true;

  const expiryTime = decoded.exp * 1000; // Convert to milliseconds
  const currentTime = Date.now();

  return expiryTime - currentTime < REFRESH_THRESHOLD;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded) return false;

  // Check if token is expired
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// Get user role from localStorage
export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await fetch(API_BASE_URL + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store token and user data in localStorage
    localStorage.setItem("authToken", data.token);
    setLocalStorage("userData", data.user);

    // Set up storage event listener for cross-tab authentication
    setupAuthListener();

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await fetch(API_BASE_URL + "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await apiLogout();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Broadcast logout to other tabs
    localStorage.setItem("auth_event", "logout");
    localStorage.removeItem("auth_event");

    // Force reload to clear any in-memory state
    window.location.href = "/login";
  }
};

// Setup cross-tab authentication listener
export const setupAuthListener = () => {
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === "auth_event" && event.newValue === "logout") {
        // Another tab logged out, sync this tab
        window.location.href = "/login";
      }
    });
  }
};

// Validate and refresh token if needed
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    if (shouldRefreshToken(token)) {
      // Token needs refresh
      const response = await fetch(API_BASE_URL + "/api/auth/refresh", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token refresh failed, force logout
        await logout();
        return false;
      }

      const { token: newToken } = await response.json();
      localStorage.setItem("authToken", newToken);
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    await logout();
    return false;
  }
};
