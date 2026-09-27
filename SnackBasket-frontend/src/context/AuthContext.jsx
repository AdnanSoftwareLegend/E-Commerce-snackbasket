"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserProfile();
      setUser(userData.user || userData);
    } catch (error) {
      console.error("Session expired or invalid token");
      logout();
    } finally {
      setLoading(false);
    }
  };

  const checkUserSession = async () => {
    await refreshUser();
  };

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (data.token) {
      localStorage.setItem("token", data.token);
      const { token, ...userInfo } = data.user || data;
      setUser(userInfo);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    if (data.token) {
      localStorage.setItem("token", data.token);
      const { token, ...userInfo } = data.user || data;
      setUser(userInfo);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
