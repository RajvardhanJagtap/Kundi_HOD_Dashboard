"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { set } from "date-fns";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  userType: string;
  accountStatus: string;
  authProvider: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  passwordChangedAt: string;
  accountLockedUntil: string | null;
  failedLoginAttempts: number;
  termsAcceptedAt: string | null;
  privacyPolicyAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  roles: string[] | null;
  attributes: Record<string, string>;
  isDeleted: boolean;
  isAccountLocked: boolean;
  isAccountActive: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
    permissions: string[];
    roles: string[];
    loginTime: string;
    requiresPasswordChange: boolean;
    requiresTwoFactor: boolean;
  };
  timestamp: string;
}

interface AuthContextType {
  user: User | null;
  permissions: string[];
  roles: string[];
  departmentId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getDepartmentId: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      setIsLoading(true);
      
      // The API expects 'usernameOrEmail' field based on the validation error
      const payload = {
        usernameOrEmail,
        password
      };

      const response = await api.post<LoginResponse>("/auth/login", payload);

      const { data } = response.data;

      if (!data?.accessToken || !data?.user) {
        throw new Error("No token or user received from server.");
      }

      if (typeof window !== "undefined") {
        // Helper function to set cookies with consistent max-age
        const setCookie = (name: string, value: string, maxAge: number) => {
          document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
        };
        
        // Store tokens in cookies with proper expiration
        setCookie("accessToken", data.accessToken, 86400); // 1 day in seconds
        setCookie("refreshToken", data.refreshToken, 604800); // 7 days in seconds
        
        // Store other data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("permissions", JSON.stringify(data.permissions));
        localStorage.setItem("roles", JSON.stringify(data.roles));
      }

      setUser(data.user);
      setPermissions(data.permissions);
      setRoles(data.roles);
      
      // Validate user roles - only allow HEAD_OF_DEPARTMENT and SUPERADMIN
      const allowedRoles = ["HEAD_OF_DEPARTMENT", "SUPERADMIN"];
      const hasValidRole = data.roles.some((role: string) => allowedRoles.includes(role));
      
      if (!hasValidRole) {
        throw new Error("Access denied. Only HOD and SUPERADMIN roles are allowed to access this portal.");
      }
      
    setDepartmentId(data.user.attributes?.DEPARTMENT_ID || null);
      setIsAuthenticated(true);
    } catch (error: any) {
      // Handle different types of errors
      if (error?.response?.data?.message) {
        throw error.response.data.message;
      } else if (error?.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          throw errors.join(', ');
        } else if (typeof errors === 'object') {
          throw Object.values(errors).join(', ');
        }
        throw 'Validation error: ' + JSON.stringify(errors);
      } else if (error?.response?.status === 400) {
        throw "Invalid request. Please check your credentials format.";
      } else if (error?.response?.status === 401) {
        throw "Invalid username or password. Please try again.";
      } else if (error?.response?.status >= 500) {
        throw "Server error. Please try again later.";
      } else if (error?.message) {
        throw error.message;
      } else {
        throw "Login failed. Please check your credentials and try again.";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      // Clear cookies using consistent approach
      const clearCookie = (name: string) => {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      };
      
      clearCookie("accessToken");
      clearCookie("refreshToken");
      
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("roles");
    }

    setUser(null);
    setPermissions([]);
    setRoles([]);
    setDepartmentId(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      if (typeof window === "undefined") {
        setIsAuthenticated(false);
        return;
      }

      // Helper function to get cookies
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };

      const token = getCookie("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const storedUser = localStorage.getItem("user");
      const storedPermissions = localStorage.getItem("permissions");
      const storedRoles = localStorage.getItem("roles");

      if (storedUser && storedPermissions && storedRoles) {
        setUser(JSON.parse(storedUser));
        setPermissions(JSON.parse(storedPermissions));
        setRoles(JSON.parse(storedRoles));
        setDepartmentId(JSON.parse(storedUser).attributes?.DEPARTMENT_ID || null);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const getDepartmentId = (): string | null => {
    return departmentId || user?.attributes?.DEPARTMENT_ID || null;
  }

  useEffect(() => {
    checkAuth();

    // Listen for logout events from token refresh failures
    const handleLogoutEvent = () => {
      console.log('Received logout event, clearing auth state');
      logout();
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const value: AuthContextType = {
    user,
    permissions,
    roles,
    departmentId,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    getDepartmentId
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};