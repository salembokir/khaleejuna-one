// ==========================================================================
// KHALIJEUNA WAHID - AUTHENTICATION UTILITIES & STORAGE HELPERS
// ==========================================================================

export const AUTH_TOKEN_KEY = 'khaleejuna_token';
export const AUTH_USER_KEY = 'khaleejuna_user';

/**
 * الحصول على توكن الجلسة من التخزين المحلي
 * @returns {string|null}
 */
export const getToken = () => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null;
  } catch (error) {
    console.error('Error retrieving auth token from localStorage:', error);
    return null;
  }
};

/**
 * حفظ توكن الجلسة في التخزين المحلي
 * @param {string} token
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error saving auth token to localStorage:', error);
  }
};

/**
 * الحصول على بيانات المستخدم المحفوظة
 * @returns {object|null}
 */
export const getUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * حفظ بيانات المستخدم في التخزين المحلي
 * @param {object} user
 */
export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

/**
 * حفظ جلسة المصادقة بالكامل (التوكن وبيانات المستخدم)
 * @param {string} token
 * @param {object} user
 */
export const saveAuthSession = (token, user) => {
  setToken(token);
  setUser(user);
};

/**
 * مسح جميع بيانات جلسة المصادقة
 */
export const clearAuthSession = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error('Error clearing auth session:', error);
  }
};

/**
 * التحقق مما إذا كان المستخدم مسجل دخوله حالياً بناءً على وجود التوكن
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token);
};
