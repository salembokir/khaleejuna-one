import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import '../styles/login.css';

const TranslatedToast = ({ msgKey }) => {
  const { t } = useLanguage();
  return <span>{t(msgKey)}</span>;
};

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signin');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In State
  const [signinData, setSigninData] = useState({
    loginUser: '',
    loginPassword: '',
    rememberMe: false
  });
  const [signinErrors, setSigninErrors] = useState({});

  // Sign Up State: Full Name, Email or Phone, Password, Confirm Password, Terms
  const [signupData, setSignupData] = useState({
    name: '',
    user: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [signupErrors, setSignupErrors] = useState({});

  // Validation Patterns & Helpers
  const REGEX_NAME = /^[\u0600-\u06FFa-zA-Z\s]{2,60}$/;
  const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isValidEmail = (email) => {
    const clean = email.trim();
    if (!REGEX_EMAIL.test(clean)) return false;
    const parts = clean.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false;
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1];
    return tld.length >= 2;
  };

  const isValidPhone = (phone) => {
    const clean = phone.trim();
    if (!/^\+?[0-9\s-]{9,20}$/.test(clean)) return false;
    const digits = clean.replace(/\D/g, '');
    return digits.length >= 9;
  };

  const isValidUserIdentifier = (val) => {
    const clean = val.trim();
    if (!clean) return false;
    if (clean.includes('@')) {
      return isValidEmail(clean);
    }
    return isValidPhone(clean);
  };

  // Sign In Handlers
  const handleSigninChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setSigninData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    // إزالة رسالة الخطأ تلقائياً فور تصحيح القيمة
    if (signinErrors[name]) {
      if (name === 'loginUser') {
        if (isValidUserIdentifier(newValue)) {
          setSigninErrors((prev) => ({ ...prev, loginUser: '' }));
        }
      } else if (name === 'loginPassword') {
        if (typeof newValue === 'string' && newValue.trim().length > 0) {
          setSigninErrors((prev) => ({ ...prev, loginPassword: '' }));
        }
      } else {
        setSigninErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSigninSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const userVal = signinData.loginUser.trim();
    const passVal = signinData.loginPassword;
    const errors = {};

    // 1. فحص البريد الإلكتروني أو رقم الجوال
    if (!userVal) {
      errors.loginUser = 'val_user_required';
    } else if (!isValidUserIdentifier(userVal)) {
      errors.loginUser = 'val_user_invalid';
    }

    // 2. فحص كلمة المرور
    if (!passVal) {
      errors.loginPassword = 'val_pass_required';
    }

    // منع الإرسال في حال وجود حقول غير صحيحة أو فارغة وإظهار إشعار
    if (Object.keys(errors).length > 0) {
      setSigninErrors(errors);
      toast.error(<TranslatedToast msgKey="toast_form_errors" />);
      return;
    }

    setSigninErrors({});
    setIsLoading(true);

    // محاكاة إرسال الطلب وحالة التحميل التفاعلية
    setTimeout(() => {
      setIsLoading(false);
      toast.success(<TranslatedToast msgKey="toast_login_success" />);

      setTimeout(() => {
        navigate('/');
      }, 1200);
    }, 1200);
  };

  // Sign Up Handlers
  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'name') {
      newValue = value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
    }

    setSignupData((prev) => ({
      ...prev,
      [name]: newValue
    }));

    // إزالة رسالة الخطأ تلقائياً فور تصحيح القيمة
    if (signupErrors[name] || (name === 'password' && signupErrors.confirmPassword)) {
      if (name === 'name') {
        if (newValue.trim().length >= 2 && REGEX_NAME.test(newValue.trim())) {
          setSignupErrors((prev) => ({ ...prev, name: '' }));
        }
      } else if (name === 'user') {
        if (isValidUserIdentifier(newValue)) {
          setSignupErrors((prev) => ({ ...prev, user: '' }));
        }
      } else if (name === 'password') {
        setSignupErrors((prev) => {
          const next = { ...prev };
          if (newValue.length >= 8) {
            next.password = '';
          }
          if (signupData.confirmPassword && signupData.confirmPassword === newValue) {
            next.confirmPassword = '';
          }
          return next;
        });
      } else if (name === 'confirmPassword') {
        if (newValue && newValue === signupData.password) {
          setSignupErrors((prev) => ({ ...prev, confirmPassword: '' }));
        }
      } else if (name === 'termsAccepted') {
        if (newValue) {
          setSignupErrors((prev) => ({ ...prev, termsAccepted: '' }));
        }
      }
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const nameVal = signupData.name.trim();
    const userVal = signupData.user.trim();
    const passVal = signupData.password;
    const confirmVal = signupData.confirmPassword;
    const errors = {};

    // 1. الاسم الكامل
    if (!nameVal) {
      errors.name = 'val_name_required';
    } else if (!REGEX_NAME.test(nameVal)) {
      errors.name = 'val_name_invalid';
    }

    // 2. البريد الإلكتروني أو رقم الجوال (صيغة إيميل صحيحة أو هاتف لا يقل عن 9 أرقام)
    if (!userVal) {
      errors.user = 'val_user_required';
    } else if (!isValidUserIdentifier(userVal)) {
      errors.user = 'val_user_invalid';
    }

    // 3. كلمة المرور (ألا تقل عن 8 خانات)
    if (!passVal) {
      errors.password = 'val_pass_required';
    } else if (passVal.length < 8) {
      errors.password = 'val_pass_len';
    }

    // 4. تأكيد كلمة المرور (مطابقة كلمة المرور تماماً)
    if (!confirmVal) {
      errors.confirmPassword = 'val_confirm_required';
    } else if (confirmVal !== passVal) {
      errors.confirmPassword = 'val_pass_mismatch';
    }

    // 5. الموافقة على الشروط
    if (!signupData.termsAccepted) {
      errors.termsAccepted = 'val_terms_required';
    }

    // منع الإرسال في حال وجود حقول غير صحيحة أو فارغة وإظهار إشعار
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      toast.error(<TranslatedToast msgKey="toast_form_errors" />);
      return;
    }

    setSignupErrors({});
    setIsLoading(true);

    // محاكاة إرسال طلب إنشاء الحساب وحالة التحميل التفاعلية
    setTimeout(() => {
      setIsLoading(false);
      toast.success(<TranslatedToast msgKey="toast_signup_success" />);

      setTimeout(() => {
        setActiveTab('signin');
        setSignupData({
          name: '',
          user: '',
          password: '',
          confirmPassword: '',
          termsAccepted: false
        });
      }, 1200);
    }, 1400);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast(<TranslatedToast msgKey="val_forgot_msg" />, {
      icon: 'ℹ️',
      style: {
        border: '1.8px solid #b9935a',
      }
    });
  };

  const handleTabSwitch = (tab) => {
    if (isLoading) return;
    setActiveTab(tab);
    setSigninErrors({});
    setSignupErrors({});
  };

  return (
    <main className="content-wrapper">
      <section id="login" className="login-page-section">
        <div className="login-content-container">
          <div className="login-card">
            {/* التبويبات التفاعلية مع الخط الذهبي المتحرك */}
            <div className="login-tabs">
              <button
                type="button"
                className={`login-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('signin')}
                disabled={isLoading}
              >
                {t('tab_signin')}
              </button>
              <button
                type="button"
                className={`login-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                onClick={() => handleTabSwitch('signup')}
                disabled={isLoading}
              >
                {t('tab_signup')}
              </button>
            </div>

            {/* نموذج تسجيل الدخول */}
            {activeTab === 'signin' && (
              <form id="signin-form" className="auth-form" onSubmit={handleSigninSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="login-email">{t('label_login_user')}</label>
                  <input
                    type="text"
                    id="login-email"
                    name="loginUser"
                    value={signinData.loginUser}
                    onChange={handleSigninChange}
                    placeholder={t('placeholder_login_user')}
                    className={signinErrors.loginUser ? 'input-error' : ''}
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  {signinErrors.loginUser && (
                    <span className="field-error-text">{t(signinErrors.loginUser)}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="login-password">{t('label_login_password')}</label>
                  <input
                    type="password"
                    id="login-password"
                    name="loginPassword"
                    value={signinData.loginPassword}
                    onChange={handleSigninChange}
                    placeholder={t('placeholder_login_password')}
                    className={signinErrors.loginPassword ? 'input-error' : ''}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  {signinErrors.loginPassword && (
                    <span className="field-error-text">{t(signinErrors.loginPassword)}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      id="remember-me-check"
                      name="rememberMe"
                      checked={signinData.rememberMe}
                      onChange={handleSigninChange}
                      disabled={isLoading}
                    />
                    <span>{t('label_remember')}</span>
                  </label>
                  <a
                    href="#forgot"
                    className="forgot-password-link"
                    onClick={handleForgotPassword}
                  >
                    {t('link_forgot')}
                  </a>
                </div>

                <button
                  type="submit"
                  className={`btn-auth-submit ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true"></span>
                      <span>{t('btn_loading')}</span>
                    </>
                  ) : (
                    <span>{t('btn_signin_submit')}</span>
                  )}
                </button>
              </form>
            )}

            {/* نموذج إنشاء حساب جديد */}
            {activeTab === 'signup' && (
              <form id="signup-form" className="auth-form" onSubmit={handleSignupSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="reg-name">{t('label_reg_name')}</label>
                  <input
                    type="text"
                    id="reg-name"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    placeholder={t('placeholder_reg_name')}
                    className={signupErrors.name ? 'input-error' : ''}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                  {signupErrors.name && (
                    <span className="field-error-text">{t(signupErrors.name)}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-user">{t('label_reg_user')}</label>
                  <input
                    type="text"
                    id="reg-user"
                    name="user"
                    value={signupData.user}
                    onChange={handleSignupChange}
                    placeholder={t('placeholder_reg_user')}
                    className={signupErrors.user ? 'input-error' : ''}
                    autoComplete="username"
                    disabled={isLoading}
                  />
                  {signupErrors.user && (
                    <span className="field-error-text">{t(signupErrors.user)}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password">{t('label_reg_password')}</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder={t('placeholder_reg_password')}
                    className={signupErrors.password ? 'input-error' : ''}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  {signupErrors.password && (
                    <span className="field-error-text">{t(signupErrors.password)}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reg-password-confirm">{t('label_reg_confirm')}</label>
                  <input
                    type="password"
                    id="reg-password-confirm"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder={t('placeholder_reg_confirm')}
                    className={signupErrors.confirmPassword ? 'input-error' : ''}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                  {signupErrors.confirmPassword && (
                    <span className="field-error-text">{t(signupErrors.confirmPassword)}</span>
                  )}
                </div>

                <div className="form-options terms-row">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      id="terms-accept-check"
                      name="termsAccepted"
                      checked={signupData.termsAccepted}
                      onChange={handleSignupChange}
                      disabled={isLoading}
                    />
                    <span>{t('label_terms')}</span>
                  </label>
                </div>
                {signupErrors.termsAccepted && (
                  <span className="terms-error-text">{t(signupErrors.termsAccepted)}</span>
                )}

                <button
                  type="submit"
                  className={`btn-auth-submit ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true"></span>
                      <span>{t('btn_loading')}</span>
                    </>
                  ) : (
                    <span>{t('btn_signup_submit')}</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;