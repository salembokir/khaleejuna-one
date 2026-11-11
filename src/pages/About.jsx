import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  blackWhiteRollsImg,
  factoryImg,
  rollsImg,
  ropesImg,
  logoGoldImg
} from '../assets/images';
import '../styles/about.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <main className="content-wrapper">
      <section id="about" className="page-section">
        {/* بنر الصفحة */}
        <div className="hero-banner hero-banner-compact">
          <div className="hero-container">
            <h1 className="hero-title text-center">{t('about_page_title')}</h1>
          </div>
        </div>

        <div className="about-content">
          <div className="about-container">
            {/* جانب شبكة الصور (يسار) */}
            <div className="about-gallery-side">
              <div className="gallery-grid">
                <img src={blackWhiteRollsImg} alt="رولات ابيض واسود" className="gallery-img" />
                <img src={factoryImg} alt="مصنع" className="gallery-img" />
                <img src={rollsImg} alt="رولات" className="gallery-img" />
                <img src={ropesImg} alt="حبال" className="gallery-img" />
              </div>
            </div>

            {/* جانب النص والشعار (يمين) */}
            <div className="about-text-side">
              <div className="about-logo-card">
                <img src={logoGoldImg} alt="شعار خليجنا واحد الذهبي" className="about-gold-logo" />
                <h2 className="about-section-title">{t('about_card_title')}</h2>
                <p className="about-text">{t('about_p1')}</p>
                <p className="about-text">{t('about_p2')}</p>
                <div className="about-actions" style={{ marginTop: '1rem' }}>
                  <Link to="/contact" className="btn btn-gold">
                    {t('about_btn_contact')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
