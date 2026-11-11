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
        alert(getMsg('val_forgot_msg'));
    };

    // 4. محرك التحقق الصارم من الحقول (Validation Engine)
    function getMsg(key) {
        const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'ar';
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            return window.translations[lang][key];
        }
        return (window.translations?.ar && window.translations.ar[key]) ? window.translations.ar[key] : key;
    }

    const REGEX_NAME = /^[\u0600-\u06FFa-zA-Z\s]{2,60}$/;
    const REGEX_PHONE = /^(\+?[0-9]{9,15})$/;
    const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function isValidName(val) {
        return REGEX_NAME.test(val.trim());
    }

    function isValidPhone(val) {
        const clean = val.trim();
        return REGEX_PHONE.test(clean);
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

    // تصفية فورية للمدخلات
    function attachLiveSanitization() {
        const regName = document.getElementById('reg-name');
        if (regName) {
            regName.addEventListener('input', () => {
                const sanitized = regName.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                if (regName.value !== sanitized) {
                    regName.value = sanitized;
                }
                regName.classList.remove('input-error');
            });
        }

        const userInputs = [document.getElementById('login-email'), document.getElementById('reg-user')];
        userInputs.forEach(inp => {
            if (inp) {
                inp.addEventListener('input', () => inp.classList.remove('input-error'));
            }
        });
    }

    attachLiveSanitization();

    // 5. نموذج تسجيل الدخول (Sign In Submission)
    const signinForm = document.getElementById('signin-form');
    const signinFeedback = document.getElementById('signin-feedback');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userInput = document.getElementById('login-email');
            const passInput = document.getElementById('login-password');
            const userVal = userInput?.value.trim() || '';
            const passVal = passInput?.value || '';

            userInput?.classList.remove('input-error');
            passInput?.classList.remove('input-error');

            if (!userVal) {
                showFeedback(signinFeedback, getMsg('val_email_required'), 'error', userInput);
                return;
            }

            if (userVal.includes('@')) {
                if (!isValidEmail(userVal)) {
                    showFeedback(signinFeedback, getMsg('val_email_invalid'), 'error', userInput);
                    return;
                }
            } else {
                if (!isValidPhone(userVal)) {
                    showFeedback(signinFeedback, getMsg('val_phone_invalid'), 'error', userInput);
                    return;
                }
            }

            if (!passVal) {
                showFeedback(signinFeedback, getMsg('placeholder_login_password'), 'error', passInput);
                return;
            }

            showFeedback(signinFeedback, getMsg('val_login_success'), 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1200);
        });
    }

    // 6. نموذج إنشاء حساب جديد (Sign Up Submission)
    const signupForm = document.getElementById('signup-form');
    const signupFeedback = document.getElementById('signup-feedback');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('reg-name');
            const userInput = document.getElementById('reg-user');
            const passInput = document.getElementById('reg-password');
            const confirmInput = document.getElementById('reg-password-confirm');
            const termsInput = document.getElementById('terms-accept-check');

            const name = nameInput?.value.trim() || '';
            const userVal = userInput?.value.trim() || '';
            const pass = passInput?.value || '';
            const passConfirm = confirmInput?.value || '';

            [nameInput, userInput, passInput, confirmInput].forEach(i => i?.classList.remove('input-error'));

            // 1. فحص الاسم
            if (!name || !isValidName(name)) {
                showFeedback(signupFeedback, getMsg('val_name_invalid'), 'error', nameInput);
                return;
            }

            // 2. فحص البريد الإلكتروني أو رقم الجوال
            if (!userVal) {
                showFeedback(signupFeedback, getMsg('val_email_required'), 'error', userInput);
                return;
            }

            if (userVal.includes('@')) {
                if (!isValidEmail(userVal)) {
                    showFeedback(signupFeedback, getMsg('val_email_invalid'), 'error', userInput);
                    return;
                }
            } else {
                if (!isValidPhone(userVal)) {
                    showFeedback(signupFeedback, getMsg('val_phone_invalid'), 'error', userInput);
                    return;
                }
            }

            // 4. فحص كلمة المرور
            if (pass.length < 6) {
                showFeedback(signupFeedback, getMsg('val_pass_len'), 'error', passInput);
                return;
            }

            // 5. تطابق كلمتي المرور
            if (pass !== passConfirm) {
                showFeedback(signupFeedback, getMsg('val_pass_mismatch'), 'error', confirmInput);
                return;
            }

            // 6. الموافقة على الشروط
            if (termsInput && !termsInput.checked) {
                showFeedback(signupFeedback, getMsg('val_terms_required'), 'error');
                return;
            }

            showFeedback(signupFeedback, getMsg('val_signup_success'), 'success');
            setTimeout(() => {
                window.toggleLoginTabs('signin');
                signupForm.reset();
            }, 1800);
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
