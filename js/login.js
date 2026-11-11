// ==========================================================================
// KHALIJEUNA WAHID - LOGIN & REGISTER PAGE JAVASCRIPT (login.js)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. القائمة الجانبية للجوال (Mobile Menu Toggle)
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navbar = document.querySelector('.navbar');

    if (mobileToggleBtn && navbar) {
        mobileToggleBtn.addEventListener('click', () => {
            navbar.classList.toggle('mobile-active');
            const icon = mobileToggleBtn.querySelector('i');
            if (navbar.classList.contains('mobile-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    // إغلاق قائمة الجوال عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (navbar && navbar.classList.contains('mobile-active') && 
            !navbar.contains(e.target) && 
            !mobileToggleBtn?.contains(e.target)) {
            navbar.classList.remove('mobile-active');
            if (mobileToggleBtn?.querySelector('i')) {
                mobileToggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        }
    });

    // 2. دالة التوافق للانتقال بين الصفحات
    window.switchPage = (pageName, subSectionId = null) => {
        const pageMap = {
            'home': 'index.html',
            'about': 'about.html',
            'products': 'products.html',
            'contact': 'contact.html',
            'login': 'login.html'
        };
        const targetPage = pageMap[pageName] || `${pageName}.html`;
        const targetUrl = subSectionId ? `${targetPage}#${subSectionId}` : targetPage;
        window.location.href = targetUrl;
    };

    // 3. التبديل بين تبويبي تسجيل الدخول وإنشاء حساب
    window.toggleLoginTabs = (type) => {
        const tabLoginBtn = document.getElementById('tab-login-btn');
        const tabRegisterBtn = document.getElementById('tab-register-btn');
        const signinWrapper = document.getElementById('signin-form-wrapper');
        const signupWrapper = document.getElementById('signup-form-wrapper');
        
        document.querySelectorAll('.field-error-text, .terms-error-text').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
            delete el.dataset.errorKey;
        });
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        
        if (type === 'signin') {
            if (tabLoginBtn) tabLoginBtn.classList.add('active');
            if (tabRegisterBtn) tabRegisterBtn.classList.remove('active');
            if (signinWrapper) signinWrapper.classList.add('active');
            if (signupWrapper) signupWrapper.classList.remove('active');
        } else if (type === 'signup') {
            if (tabLoginBtn) tabLoginBtn.classList.remove('active');
            if (tabRegisterBtn) tabRegisterBtn.classList.add('active');
            if (signinWrapper) signinWrapper.classList.remove('active');
            if (signupWrapper) signupWrapper.classList.add('active');
        }
    };

    window.handleForgotPassword = (e) => {
        e.preventDefault();
        showToast('val_forgot_msg', 'info');
    };

    // 4. محرك التحقق الصارم من الحقول (Validation Engine)
    function getMsg(key) {
        if (typeof getTranslation === 'function') {
            return getTranslation(key);
        }
        const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'ar';
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            return window.translations[lang][key];
        }
        return (window.translations?.ar && window.translations.ar[key]) ? window.translations.ar[key] : key;
    }

    const REGEX_NAME = /^[\u0600-\u06FFa-zA-Z\s]{2,60}$/;
    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function isValidName(val) {
        return REGEX_NAME.test(val.trim());
    }

    function isValidPhone(val) {
        const clean = val.trim();
        if (!/^\+?[0-9\s-]{9,20}$/.test(clean)) return false;
        const digits = clean.replace(/\D/g, '');
        return digits.length >= 9;
    }

    function isValidEmail(val) {
        const clean = val.trim();
        if (!REGEX_EMAIL.test(clean)) return false;
        const parts = clean.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1];
        if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false;
        const domainParts = domain.split('.');
        const tld = domainParts[domainParts.length - 1];
        return tld.length >= 2;
    }

    function isValidUserIdentifier(val) {
        const clean = val.trim();
        if (!clean) return false;
        if (clean.includes('@')) {
            return isValidEmail(clean);
        }
        return isValidPhone(clean);
    }

    function setFieldError(fieldId, errorElementId, messageKey) {
        const input = fieldId ? document.getElementById(fieldId) : null;
        const errorSpan = document.getElementById(errorElementId);
        if (input) input.classList.add('input-error');
        if (errorSpan) {
            errorSpan.dataset.errorKey = messageKey;
            errorSpan.textContent = getMsg(messageKey);
            errorSpan.style.display = 'block';
        }
    }

    function clearFieldError(fieldId, errorElementId) {
        const input = fieldId ? document.getElementById(fieldId) : null;
        const errorSpan = document.getElementById(errorElementId);
        if (input) input.classList.remove('input-error');
        if (errorSpan) {
            delete errorSpan.dataset.errorKey;
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
    }

    // تصفية فورية للمدخلات وإزالة الخطأ تلقائياً فور التصحيح
    function attachLiveSanitization() {
        const regName = document.getElementById('reg-name');
        if (regName) {
            regName.addEventListener('input', () => {
                const sanitized = regName.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                if (regName.value !== sanitized) {
                    regName.value = sanitized;
                }
                if (sanitized.trim().length >= 2 && isValidName(sanitized)) {
                    clearFieldError('reg-name', 'error-reg-name');
                }
            });
        }

        const loginEmail = document.getElementById('login-email');
        if (loginEmail) {
            loginEmail.addEventListener('input', () => {
                if (isValidUserIdentifier(loginEmail.value)) {
                    clearFieldError('login-email', 'error-login-email');
                }
            });
        }

        const loginPass = document.getElementById('login-password');
        if (loginPass) {
            loginPass.addEventListener('input', () => {
                if (loginPass.value.trim().length > 0) {
                    clearFieldError('login-password', 'error-login-password');
                }
            });
        }

        const regUser = document.getElementById('reg-user');
        if (regUser) {
            regUser.addEventListener('input', () => {
                if (isValidUserIdentifier(regUser.value)) {
                    clearFieldError('reg-user', 'error-reg-user');
                }
            });
        }

        const regPass = document.getElementById('reg-password');
        const regConfirm = document.getElementById('reg-password-confirm');
        if (regPass) {
            regPass.addEventListener('input', () => {
                if (regPass.value.length >= 8) {
                    clearFieldError('reg-password', 'error-reg-password');
                }
                if (regConfirm && regConfirm.value.length > 0 && regConfirm.value === regPass.value) {
                    clearFieldError('reg-password-confirm', 'error-reg-password-confirm');
                }
            });
        }

        if (regConfirm) {
            regConfirm.addEventListener('input', () => {
                if (regPass && regConfirm.value.length > 0 && regConfirm.value === regPass.value) {
                    clearFieldError('reg-password-confirm', 'error-reg-password-confirm');
                }
            });
        }

        const termsCheck = document.getElementById('terms-accept-check');
        if (termsCheck) {
            termsCheck.addEventListener('change', () => {
                if (termsCheck.checked) {
                    clearFieldError('terms-accept-check', 'error-terms');
                }
            });
        }
    }

    attachLiveSanitization();

    // دالة إظهار الإشعارات المنبثقة (Toast Notification)
    function showToast(messageKey, type = 'success') {
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; width: 90%; max-width: 420px;';
            document.body.appendChild(toastContainer);
        }

        const isRtl = (typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'ar') === 'ar';
        const toast = document.createElement('div');
        toast.dataset.toastKey = messageKey;
        toast.style.cssText = `
            pointer-events: auto;
            direction: ${isRtl ? 'rtl' : 'ltr'};
            text-align: ${isRtl ? 'right' : 'left'};
            font-family: 'Cairo', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            padding: 13px 20px;
            border-radius: 12px;
            border: 1.8px solid ${type === 'error' ? '#f87171' : '#b9935a'};
            background: #ffffff;
            color: ${type === 'error' ? '#dc2626' : '#083325'};
            box-shadow: 0 10px 25px rgba(185, 147, 90, 0.22), 0 4px 10px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: fadeIn 0.25s ease forwards;
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;

        const iconMap = { error: '⚠️', info: 'ℹ️', success: '✅' };
        const iconSpan = document.createElement('span');
        iconSpan.style.fontSize = '1.2rem';
        iconSpan.textContent = iconMap[type] || '✅';

        const msgSpan = document.createElement('span');
        msgSpan.className = 'toast-message-text';
        msgSpan.textContent = getMsg(messageKey);

        toast.appendChild(iconSpan);
        toast.appendChild(msgSpan);
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 350);
        }, 4000);
    }

    // دالة التحكم في حالة التحميل للأزرار
    function setBtnLoading(button, isLoading, defaultTextKey) {
        if (!button) return;
        button.disabled = isLoading;
        button.dataset.loading = isLoading ? 'true' : 'false';
        button.dataset.defaultTextKey = defaultTextKey;
        if (isLoading) {
            button.classList.add('loading');
            button.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span><span>${getMsg('btn_loading')}</span>`;
        } else {
            button.classList.remove('loading');
            button.innerHTML = `<span>${getMsg(defaultTextKey)}</span>`;
        }
    }

    // تحديث رسائل الخطأ والإشعارات فورياً عند تبديل اللغة
    window.addEventListener('languageChanged', (e) => {
        const lang = e?.detail?.lang || ((typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'ar');
        const isRtl = lang === 'ar';

        document.querySelectorAll('.field-error-text[data-error-key], .terms-error-text[data-error-key]').forEach(el => {
            if (el.style.display !== 'none' && el.dataset.errorKey) {
                el.textContent = getMsg(el.dataset.errorKey);
            }
        });

        document.querySelectorAll('#toast-container [data-toast-key]').forEach(toastEl => {
            const msgEl = toastEl.querySelector('.toast-message-text');
            if (msgEl && toastEl.dataset.toastKey) {
                msgEl.textContent = getMsg(toastEl.dataset.toastKey);
            }
            toastEl.style.direction = isRtl ? 'rtl' : 'ltr';
            toastEl.style.textAlign = isRtl ? 'right' : 'left';
        });

        document.querySelectorAll('.btn-auth-submit[data-loading="true"]').forEach(btn => {
            setBtnLoading(btn, true, btn.dataset.defaultTextKey || 'btn_signin_submit');
        });
    });

    // 5. نموذج تسجيل الدخول (Sign In Submission)
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = signinForm.querySelector('.btn-auth-submit');
            if (submitBtn && submitBtn.disabled) return;

            const userInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            const userVal = userInput?.value.trim() || '';
            const passVal = passInput?.value || '';
            let hasError = false;

            // التحقق من الحقل الأول
            if (!userVal) {
                setFieldError('login-email', 'error-login-email', 'val_user_required');
                hasError = true;
            } else if (!isValidUserIdentifier(userVal)) {
                setFieldError('login-email', 'error-login-email', 'val_user_invalid');
                hasError = true;
            } else {
                clearFieldError('login-email', 'error-login-email');
            }

            // التحقق من كلمة المرور
            if (!passVal) {
                setFieldError('login-password', 'error-login-password', 'val_pass_required');
                hasError = true;
            } else {
                clearFieldError('login-password', 'error-login-password');
            }

            if (hasError) {
                showToast('toast_form_errors', 'error');
                return;
            }

            setBtnLoading(submitBtn, true, 'btn_signin_submit');

            setTimeout(() => {
                setBtnLoading(submitBtn, false, 'btn_signin_submit');
                showToast('toast_login_success', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1200);
            }, 1200);
        });
    }

    // 6. نموذج إنشاء حساب جديد (Sign Up Submission)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = signupForm.querySelector('.btn-auth-submit');
            if (submitBtn && submitBtn.disabled) return;

            const nameInput = document.getElementById('reg-name');
            const userInput = document.getElementById('reg-user');
            const passInput = document.getElementById('reg-password');
            const confirmInput = document.getElementById('reg-password-confirm');
            const termsInput = document.getElementById('terms-accept-check');

            const name = nameInput?.value.trim() || '';
            const userVal = userInput?.value.trim() || '';
            const pass = passInput?.value || '';
            const passConfirm = confirmInput?.value || '';
            let hasError = false;

            // 1. فحص الاسم الكامل
            if (!name) {
                setFieldError('reg-name', 'error-reg-name', 'val_name_required');
                hasError = true;
            } else if (!isValidName(name)) {
                setFieldError('reg-name', 'error-reg-name', 'val_name_invalid');
                hasError = true;
            } else {
                clearFieldError('reg-name', 'error-reg-name');
            }

            // 2. فحص البريد الإلكتروني أو رقم الجوال (regex أو جوال لا يقل عن 9 أرقام)
            if (!userVal) {
                setFieldError('reg-user', 'error-reg-user', 'val_user_required');
                hasError = true;
            } else if (!isValidUserIdentifier(userVal)) {
                setFieldError('reg-user', 'error-reg-user', 'val_user_invalid');
                hasError = true;
            } else {
                clearFieldError('reg-user', 'error-reg-user');
            }

            // 3. فحص كلمة المرور (ألا يقل طولها عن 8 خانات)
            if (!pass) {
                setFieldError('reg-password', 'error-reg-password', 'val_pass_required');
                hasError = true;
            } else if (pass.length < 8) {
                setFieldError('reg-password', 'error-reg-password', 'val_pass_len');
                hasError = true;
            } else {
                clearFieldError('reg-password', 'error-reg-password');
            }

            // 4. تطابق تأكيد كلمة المرور تماماً
            if (!passConfirm) {
                setFieldError('reg-password-confirm', 'error-reg-password-confirm', 'val_confirm_required');
                hasError = true;
            } else if (pass !== passConfirm) {
                setFieldError('reg-password-confirm', 'error-reg-password-confirm', 'val_pass_mismatch');
                hasError = true;
            } else {
                clearFieldError('reg-password-confirm', 'error-reg-password-confirm');
            }

            // 5. الموافقة على الشروط
            if (termsInput && !termsInput.checked) {
                setFieldError(null, 'error-terms', 'val_terms_required');
                hasError = true;
            } else {
                clearFieldError(null, 'error-terms');
            }

            if (hasError) {
                showToast('toast_form_errors', 'error');
                return;
            }

            setBtnLoading(submitBtn, true, 'btn_signup_submit');

            setTimeout(() => {
                setBtnLoading(submitBtn, false, 'btn_signup_submit');
                showToast('toast_signup_success', 'success');
                setTimeout(() => {
                    window.toggleLoginTabs('signin');
                    signupForm.reset();
                }, 1400);
            }, 1400);
        });
    }

    function showFeedback(element, message, type, inputElement = null) {
        if (!element) return;
        element.style.display = 'block';
        element.className = `form-feedback-message ${type}`;
        element.textContent = message;

        if (inputElement) {
            inputElement.classList.add('input-error');
            inputElement.focus();
        }

        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
            }, 6000);
        }
    }
});
