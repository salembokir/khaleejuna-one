// ==========================================================================
// KHALIJEUNA WAHID - CENTRALIZED API CLIENT SERVICE (Axios)
// ==========================================================================

import axios from 'axios';
import { getToken, clearAuthSession } from '../utils/auth.js';

// تحديد عنوان الـ Base URL من متغيرات البيئة أو القيمة الافتراضية للتطوير
const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000/api';

/**
 * إنشاء نسخة مخصصة من مكتبة Axios مع الإعدادات الافتراضية
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor (اعتراض الطلبات الصادرة):
 * - إرفاق توكن المصادقة Bearer Token تلقائياً في الترويسات (Headers) إن وُجد.
 * - إرفاق لغة الموقع الحالية (Accept-Language) لدعم تعدد اللغات في الـ Backend.
 */
api.interceptors.request.use(
  (config) => {
    // جلب التوكن الحالي من التخزين المحلي
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // جلب اللغة الحالية للموقع (ar أو en)
    try {
      const currentLang = localStorage.getItem('khaleejuna_lang') || 'ar';
      config.headers['Accept-Language'] = currentLang;
    } catch {
      // تجاهل أخطاء التخزين إن وجدت
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (اعتراض الردود الواردة):
 * - معالجة الردود الناجحة وتمريرها.
 * - اعتراض أخطاء 401 Unauthorized لمسح الجلسة منتهية الصلاحية وإشعار التطبيق لتسجيل الخروج.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: انتهاء صلاحية الجلسة أو توكن غير صالح
      if (error.response.status === 401) {
        clearAuthSession();
        // إشعار التطبيق وسياق المصادقة بالخروج التلقائي
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('auth:unauthorized', {
              detail: {
                message: error.response.data?.message || 'Session expired. Please sign in again.',
              },
            })
          );
        }
      }
    } else if (error.request) {
      // تعذر الوصول إلى الخادم أو انقطاع الاتصال
      console.error('Network Error: Unable to reach API server', error.request);
    }

    return Promise.reject(error);
  }
);

export default api;
