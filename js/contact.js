// ==========================================================================
// KHALIJEUNA WAHID - CONTACT US PAGE JAVASCRIPT (contact.js)
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

    // 3. محرك التحقق من صحة المدخلات (Strict Field Validation Engine)
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

    // تعابير التحقق الصارمة
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

    // تصفية فورية للمدخلات أثناء الكتابة (Real-time Input Sanitization)
    function attachLiveSanitization() {
        const nameField = document.getElementById('form-name');
        if (nameField) {
            nameField.addEventListener('input', () => {
                const sanitized = nameField.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
                if (nameField.value !== sanitized) {
                    nameField.value = sanitized;
                }
                nameField.classList.remove('input-error');
            });
        }

        const phoneField = document.getElementById('form-phone');
        if (phoneField) {
            phoneField.addEventListener('input', () => {
                let val = phoneField.value;
                const hasPlus = val.startsWith('+');
                val = val.replace(/[^0-9]/g, '');
                phoneField.value = hasPlus ? ('+' + val) : val;
                phoneField.classList.remove('input-error');
            });
        }

        const emailField = document.getElementById('form-email');
        if (emailField) {
            emailField.addEventListener('input', () => {
                emailField.classList.remove('input-error');
            });
        }
    }

    attachLiveSanitization();

    // 4. إرسال نموذج الاتصال (Contact Form Submission)
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('form-name');
            const phoneInput = document.getElementById('form-phone');
            const emailInput = document.getElementById('form-email');
            const msgInput = document.getElementById('form-message');

            const name = nameInput?.value.trim() || '';
            const phone = phoneInput?.value.trim() || '';
            const email = emailInput?.value.trim() || '';
            const message = msgInput?.value.trim() || '';

            [nameInput, phoneInput, emailInput, msgInput].forEach(inp => inp?.classList.remove('input-error'));

            // 1. فحص الاسم: أحرف فقط
            if (!name) {
                showFeedback(formFeedback, 'val_name_required', 'error', nameInput);
                return;
            }
            if (!isValidName(name)) {
                showFeedback(formFeedback, 'val_name_invalid', 'error', nameInput);
                return;
            }

            // 2. فحص الهاتف: أرقام فقط
            if (!phone) {
                showFeedback(formFeedback, 'val_phone_required', 'error', phoneInput);
                return;
            }
            if (!isValidPhone(phone)) {
                showFeedback(formFeedback, 'val_phone_invalid', 'error', phoneInput);
                return;
            }

            // 3. فحص الإيميل الصارم
            if (!email) {
                showFeedback(formFeedback, 'val_email_required', 'error', emailInput);
                return;
            }
            if (!isValidEmail(email)) {
                showFeedback(formFeedback, 'val_email_invalid', 'error', emailInput);
                return;
            }

            // 4. فحص الرسالة
            if (message.length < 5) {
                showFeedback(formFeedback, 'val_message_required', 'error', msgInput);
                return;
            }

            // إرسال ناجح
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = getMsg('val_sending');
            }

            setTimeout(() => {
                showFeedback(formFeedback, 'val_contact_success', 'success');
                contactForm.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = getMsg('btn_send');
                }
            }, 800);
        });
    }

    function showFeedback(element, messageKey, type, inputElement = null) {
        if (!element) return;
        element.dataset.feedbackKey = messageKey;
        element.style.display = 'block';
        element.className = `form-feedback-message ${type}`;
        element.textContent = getMsg(messageKey);

        if (inputElement) {
            inputElement.classList.add('input-error');
            inputElement.focus();
        }

        if (type === 'success') {
            setTimeout(() => {
                element.style.display = 'none';
                delete element.dataset.feedbackKey;
            }, 6000);
        }
    }

    // تحديث رسالة التنبيه وزر الإرسال فورياً عند تبديل اللغة
    window.addEventListener('languageChanged', () => {
        if (formFeedback && formFeedback.style.display !== 'none' && formFeedback.dataset.feedbackKey) {
            formFeedback.textContent = getMsg(formFeedback.dataset.feedbackKey);
        }
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn && submitBtn.disabled) {
            submitBtn.textContent = getMsg('val_sending');
        }
    });
});
