import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { logoImg } from '../assets/images';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="main-header">
      <div className="header-container">
        {/* الشعار والاسم */}
        <Link to="/" className="logo-wrapper" onClick={() => setMobileOpen(false)}>
          <img src={logoImg} alt={t('company_name')} className="header-logo" />
          <div className="logo-text">
            <span className="company-name">{t('company_name')}</span>
            <span className="company-subname">{t('company_subname')}</span>
          </div>
        </Link>

        {/* روابط التنقل */}
        <nav className={`navbar ${mobileOpen ? 'mobile-active' : ''}`}>
          <ul className="nav-menu">
            <li>
              <Link
                to="/"
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav_home')}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav_about')}
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav_products')}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {t('nav_contact')}
              </Link>
            </li>
          </ul>
        </nav>

        {/* زر الإجراء الرئيسي وزر اللغة */}
        <div className="header-actions">
          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            aria-label="تبديل اللغة / Toggle Language"
          >
            <FaGlobe />
            <span className="lang-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
          <Link
            to="/login"
            className={`btn btn-gold btn-header ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {t('btn_login')}
          </Link>
        </div>

        {/* زر الجوال */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
