import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { logoImg } from '../assets/images';
import { FaLocationDot, FaEnvelope, FaPhone } from 'react-icons/fa6';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* عمود التواصل */}
        <div className="footer-col col-contact">
          <h3 className="footer-col-title">{t('footer_contact_title')}</h3>
          <ul className="footer-links">
            <li>
              <FaLocationDot /> <span>{t('footer_address')}</span>
            </li>
            <li>
              <FaEnvelope /> <a href="mailto:KhalijunaWahid@gmail.com">KhalijunaWahid@gmail.com</a>
            </li>
            <li>
              <FaPhone /> <a href="tel:+966507813100" dir="ltr">+966507813100</a>
            </li>
          </ul>
        </div>

        {/* عمود الخدمات */}
        <div className="footer-col col-services">
          <h3 className="footer-col-title">{t('footer_services_title')}</h3>
          <ul className="footer-links">
            <li>
              <Link to="/products#materials-sec">{t('footer_link_materials')}</Link>
            </li>
            <li>
              <Link to="/products#equipment-sec">{t('footer_link_equipment')}</Link>
            </li>
            <li>
              <Link to="/products#maintenance-sec">{t('footer_link_maintenance')}</Link>
            </li>
          </ul>
        </div>

        {/* عمود من نحن */}
        <div className="footer-col col-about">
          <h3 className="footer-col-title">{t('footer_about_title')}</h3>
          <p className="footer-about-text">{t('footer_about_text')}</p>
        </div>

        {/* عمود الشعار والاسم */}
        <div className="footer-col col-brand">
          <img src={logoImg} alt={t('company_name')} className="footer-logo" />
          <div className="brand-text">
            <span className="company-name">{t('company_name')}</span>
            <span className="company-subname">{t('company_subname')}</span>
          </div>
          <p className="brand-slogan">{t('brand_slogan')}</p>
          <p className="brand-desc">{t('brand_desc')}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer_rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
