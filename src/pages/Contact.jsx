import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FaPaperPlane, FaPhone, FaEnvelope, FaWhatsapp, FaMapLocationDot } from 'react-icons/fa6';
import '../styles/contact.css';

const Contact = () => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    region: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ key: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Strict Regular Expressions
  const REGEX_NAME = /^[\u0600-\u06FFa-zA-Z\s]{2,60}$/;
  const REGEX_PHONE = /^(\+?[0-9]{9,15})$/;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitized = value;

    // Real-time sanitization
    if (name === 'name') {
      sanitized = value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '');
    } else if (name === 'phone') {
      const hasPlus = value.startsWith('+');
      const digitsOnly = value.replace(/[^0-9]/g, '');
      sanitized = hasPlus ? '+' + digitsOnly : digitsOnly;
    }

    setFormData((prev) => ({ ...prev, [name]: sanitized }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
    if (feedback.key) {
      setFeedback({ key: '', type: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // 1. Name validation (letters only)
    if (!formData.name.trim()) {
      newErrors.name = true;
      setFeedback({ key: 'val_name_required', type: 'error' });
      setErrors(newErrors);
      return;
    }
    if (!REGEX_NAME.test(formData.name.trim())) {
      newErrors.name = true;
      setFeedback({ key: 'val_name_invalid', type: 'error' });
      setErrors(newErrors);
      return;
    }

    // 2. Phone validation (numbers only)
    if (!formData.phone.trim()) {
      newErrors.phone = true;
      setFeedback({ key: 'val_phone_required', type: 'error' });
      setErrors(newErrors);
      return;
    }
    if (!REGEX_PHONE.test(formData.phone.trim())) {
      newErrors.phone = true;
      setFeedback({ key: 'val_phone_invalid', type: 'error' });
      setErrors(newErrors);
      return;
    }

    // 3. Email validation (strict domain and TLD extension)
    if (!formData.email.trim()) {
      newErrors.email = true;
      setFeedback({ key: 'val_email_required', type: 'error' });
      setErrors(newErrors);
      return;
    }
    if (!isValidEmail(formData.email)) {
      newErrors.email = true;
      setFeedback({ key: 'val_email_invalid', type: 'error' });
      setErrors(newErrors);
      return;
    }

    // 4. Message validation
    if (formData.message.trim().length < 5) {
      newErrors.message = true;
      setFeedback({ key: 'val_message_required', type: 'error' });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFeedback({ key: 'val_contact_success', type: 'success' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        region: '',
        message: ''
      });

      setTimeout(() => {
        setFeedback({ key: '', type: '' });
      }, 6000);
    }, 800);
  };

  return (
    <main className="content-wrapper">
      <section id="contact" className="page-section">
        {/* بنر الصفحة */}
        <div className="hero-banner hero-banner-compact">
          <div className="hero-container">
            <h1 className="hero-title text-center">{t('contact_page_title')}</h1>
          </div>
        </div>

        <div className="contact-content-container">
          <div className="contact-grid">
            {/* نموذج الاتصال (يسار) */}
            <div className="contact-form-card">
              <h2 className="contact-card-title">
                <FaPaperPlane /> <span>{t('contact_form_title')}</span>
              </h2>

              <form id="contact-form" className="main-contact-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="form-name">{t('label_name')}</label>
                    <input
                      type="text"
                      id="form-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('placeholder_name')}
                      className={errors.name ? 'input-error' : ''}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="form-row split">
                  <div className="form-group">
                    <label htmlFor="form-phone">{t('label_phone')}</label>
                    <input
                      type="tel"
                      id="form-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      inputMode="tel"
                      placeholder={t('placeholder_phone')}
                      className={errors.phone ? 'input-error' : ''}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email">{t('label_email')}</label>
                    <input
                      type="email"
                      id="form-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      inputMode="email"
                      placeholder={t('placeholder_email')}
                      className={errors.email ? 'input-error' : ''}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-row split">
                  <div className="form-group">
                    <label htmlFor="form-company">{t('label_company')}</label>
                    <input
                      type="text"
                      id="form-company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder={t('placeholder_company')}
                      autoComplete="organization"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-region">{t('label_region')}</label>
                    <input
                      type="text"
                      id="form-region"
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      placeholder={t('placeholder_region')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="form-message">{t('label_message')}</label>
                    <textarea
                      id="form-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t('placeholder_message')}
                      className={errors.message ? 'input-error' : ''}
                    />
                  </div>
                </div>

                <div className="form-submit-row">
                  <button
                    type="submit"
                    className="btn btn-gold w-100"
                    id="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('val_sending') : t('btn_send')}
                  </button>
                </div>

                {feedback.key && (
                  <div
                    id="form-feedback"
                    className={`form-feedback-message ${feedback.type}`}
                    style={{ display: 'block' }}
                  >
                    {t(feedback.key)}
                  </div>
                )}
              </form>
            </div>

            {/* الخريطة وبيانات التواصل (يمين) */}
            <div className="contact-info-column">
              {/* الخريطة البصرية */}
              <div className="map-visual-card">
                <div className="map-placeholder">
                  <FaMapLocationDot className="map-icon-bg" />
                  <span className="map-pin-label">{t('map_pin_label')}</span>
                </div>
              </div>

              {/* كرت معلومات الاتصال المباشر */}
              <div className="direct-contact-card">
                <h3 className="info-title">{t('direct_info_title')}</h3>

                <div className="info-item">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-text">
                    <span className="info-label">{t('info_label_phone')}</span>
                    <a href="tel:+966507813100" className="info-link" dir="ltr">
                      +966507813100
                    </a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-text">
                    <span className="info-label">{t('info_label_email')}</span>
                    <a href="mailto:KhalijunaWahid@gmail.com" className="info-link">
                      KhalijunaWahid@gmail.com
                    </a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FaWhatsapp />
                  </div>
                  <div className="info-text">
                    <span className="info-label">{t('info_label_whatsapp')}</span>
                    <a
                      href="https://wa.me/966507813100"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="info-link"
                      dir="ltr"
                    >
                      +966507813100
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
