import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import {
  mapImg,
  manualWrappingImg,
  vacuumSingleImg,
  shrinkMaterialsImg,
  shrinkMachinesImg
} from '../assets/images';
import { FaTruckFast, FaScrewdriverWrench, FaGears, FaBoxOpen } from 'react-icons/fa6';
import '../styles/index.css';

const Home = () => {
  const { t } = useLanguage();

  return (
    <main className="content-wrapper">
      <section id="home" className="page-section">
        {/* بنر ترحيبي (Hero Section) */}
        <div className="hero-banner">
          <div className="hero-container">
            <div className="hero-image-side">
              <img src={mapImg} alt="خريطة شبكة التوزيع" className="hero-map-img" />
            </div>
            <div className="hero-text-side">
              <h1
                className="hero-title"
                dangerouslySetInnerHTML={{ __html: t('home_hero_title') }}
              />
              <p className="hero-description">{t('home_hero_desc')}</p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-gold">
                  {t('home_hero_btn_products')}
                </Link>
                <Link to="/contact" className="btn btn-outline-white">
                  {t('home_hero_btn_contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* قسم خدماتنا الرئيسية */}
        <div className="services-overview">
          <div className="section-title-wrapper">
            <h2 className="section-title">{t('services_section_title')}</h2>
            <div className="title-underline"></div>
          </div>
          <div className="services-grid">
            <ServiceCard
              icon={FaTruckFast}
              title={t('service_delivery')}
              link="/products#delivery-sec"
            />
            <ServiceCard
              icon={FaScrewdriverWrench}
              title={t('service_maintenance')}
              link="/products#maintenance-sec"
            />
            <ServiceCard
              icon={FaGears}
              title={t('service_equipment')}
              link="/products#equipment-sec"
            />
            <ServiceCard
              icon={FaBoxOpen}
              title={t('service_materials')}
              link="/products#materials-sec"
            />
          </div>

          <div className="section-more-btn">
            <Link to="/products" className="btn btn-gold-small">
              {t('btn_more')}
            </Link>
          </div>
        </div>

        {/* قسم منتجاتنا المميزة */}
        <div className="featured-products">
          <div className="section-title-wrapper">
            <h2 className="section-title">{t('featured_products_title')}</h2>
            <div className="title-underline"></div>
          </div>
          <div className="products-grid-home">
            <ProductCard
              variant="home"
              image={manualWrappingImg}
              title={t('feat_manual_wrapping')}
              link="/products#equipment-sec"
            />
            <ProductCard
              variant="home"
              image={vacuumSingleImg}
              title={t('feat_vacuum_single')}
              link="/products#equipment-sec"
            />
            <ProductCard
              variant="home"
              image={shrinkMaterialsImg}
              title={t('feat_shrink_materials')}
              link="/products#materials-sec"
            />
            <ProductCard
              variant="home"
              image={shrinkMachinesImg}
              title={t('feat_shrink_machines')}
              link="/products#equipment-sec"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
