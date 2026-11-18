// ==========================================================================
// KHALIJEUNA WAHID - AUTHENTICATION CONTEXT & SESSION MANAGER
// ==========================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getToken,
  getUser,
  saveAuthSession,
  clearAuthSession,
  isAuthenticated as checkIsAuthenticated,
  setUser as saveUserToStorage,
} from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // الحالة الأولية للمستخدم والتوكن من التخزين المحلي
  const [token, setToken] = useState(() => getToken());
  const [user, setUser] = useState(() => getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkIsAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  /**
   * دالة تسجيل الدخول:
   * حفظ التوكن وبيانات المستخدم في localStorage وتحديث الحالة في التطبيق
   * @param {string} newToken - توكن الجلسة القادم من الـ Backend
   * @param {object} userData - بيانات المستخدم (الاسم، البريد، الدور، إلخ)
   */
  const login = useCallback((newToken, userData) => {
    saveAuthSession(newToken, userData);
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  /**
   * دالة تسجيل الخروج:
   * مسح التوكن وبيانات المستخدم وتحديث الحالة وإعادة التوجيه لصفحة تسجيل الدخول
   * @param {string|null} redirectPath - المسار المراد التحويل إليه (الافتراضي '/login')
   */
  const logout = useCallback(
    (redirectPath = '/login') => {
      clearAuthSession();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);

      if (redirectPath && typeof navigate === 'function') {
        navigate(redirectPath);
      }
    },
    [navigate]
  );

  /**
   * دالة تحديث بيانات المستخدم الحالية (مثل تحديث الملف الشخصي)
   * @param {object} updatedData
   */
  const updateUser = useCallback((updatedData) => {
    setUser((prevUser) => {
      const merged = { ...prevUser, ...updatedData };
      saveUserToStorage(merged);
      return merged;
    });
  }, []);

  /**
   * الاستماع لحدث auth:unauthorized من الـ API interceptor
   * لتسجيل الخروج تلقائياً عند انتهاء صلاحية الجلسة
   */
  useEffect(() => {
    const handleUnauthorized = () => {
      logout('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    setIsLoading,
    login,
    logout,
    updateUser,
    checkAuth: () => checkIsAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom Hook للوصول السهل لبيانات وسياق الجلسة في أي مكون
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
