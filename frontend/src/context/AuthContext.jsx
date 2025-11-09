import React, { createContext, useContext, useState, useEffect } from 'react';
import { authUtils } from '../utils/auth.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const BACKEND_BASE_URL = 'http://localhost:3000';

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // First, try to get session from backend (@auth/express)
        fetch(`${BACKEND_BASE_URL}/api/profile`, {
          method: 'GET',
          credentials: 'include'
        })
          .then(async (res) => {
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              setIsAuthenticated(true);
            } else if (res.status === 401) {
              // Fallback to existing cookie-based (Discord) auth if present
              const isAuth = authUtils.isAuthenticated();
              setIsAuthenticated(isAuth);
              if (isAuth) {
                const userData = authUtils.getCurrentUser();
                setUser(userData);
              } else {
                setUser(null);
              }
            } else {
              setIsAuthenticated(false);
              setUser(null);
            }
          })
          .catch(() => {
            // Network error: fallback to cookie-based auth
            const isAuth = authUtils.isAuthenticated();
            setIsAuthenticated(isAuth);
            if (isAuth) {
              const userData = authUtils.getCurrentUser();
              setUser(userData);
            } else {
              setUser(null);
            }
          })
          .finally(() => setLoading(false));
        return;
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = (userData) => {
    try {
      authUtils.login(userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    try {
      // Sign out from backend session if exists
      fetch(`${BACKEND_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/x-www-form-urlencoded' }
      }).catch(() => {});
      // Also clear any local cookie-based auth and redirect
      authUtils.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Discord OAuth login
  const discordLogin = async () => {
    try {
      const authUrl = await authUtils.getDiscordAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Discord login failed:', error);
    }
  };

  // Handle Discord OAuth callback
  const handleDiscordCallback = async (code) => {
    try {
      setLoading(true);
      const result = await authUtils.handleDiscordCallback(code);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Discord callback failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login via backend (@auth/express)
  const googleLogin = () => {
    try {
      const callbackUrl = window.location.origin; // return to frontend root after login
      const url = `${BACKEND_BASE_URL}/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      window.location.href = url;
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    try {
      authUtils.login(userData);
      setUser(userData);
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    discordLogin,
    handleDiscordCallback,
    googleLogin,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};