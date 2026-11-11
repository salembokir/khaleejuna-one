import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import {
  strappingRollsImg,
  autoStrappingImg,
  cartonWrapperImg,
  continuousSealerImg,
  manualPackingImg,
  semiAutoTapingImg,
  pofRollsImg,
  pvcRollsImg,
  stretchRollsImg,
  strappingCordImg,
  clingFilmImg,
  vacuumBagsImg,
  adhesiveTapeImg,
  supportImg,
  deliveryImg
} from '../assets/images';
import { FaPhoneVolume } from 'react-icons/fa6';
import '../styles/products.css';

const Products = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('equipment-sec');
  const location = useLocation();

  const scrollToSubSection = (secId) => {
    setActiveTab(secId);
    const element = document.getElementById(secId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace('#', '');
      scrollToSubSection(hashId);
    }
  }, [location.hash]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['equipment-sec', 'materials-sec', 'maintenance-sec', 'delivery-sec'];
      const scrollPos = window.scrollY + 200;

      for (const secId of sections) {
        const sec = document.getElementById(secId);
        if (sec) {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(secId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="content-wrapper">
      <section id="products" className="page-section">
        {/* بنر الصفحة */}
        <div className="hero-banner hero-banner-compact">
          <div className="hero-container">
            <h1 className="hero-title text-center">{t('products_page_title')}</h1>
          </div>
        </div>

        <div className="products-detailed-container">
          {/* شريط تصفية الفئات السريع */}
          <div className="category-tabs-container">
            <button
              className={`tab-btn ${activeTab === 'equipment-sec' ? 'active' : ''}`}
              onClick={() => scrollToSubSection('equipment-sec')}
            >
              {t('tab_equipment')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'materials-sec' ? 'active' : ''}`}
              onClick={() => scrollToSubSection('materials-sec')}
            >
              {t('tab_materials')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'maintenance-sec' ? 'active' : ''}`}
              onClick={() => scrollToSubSection('maintenance-sec')}
            >
              {t('tab_maintenance')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'delivery-sec' ? 'active' : ''}`}
              onClick={() => scrollToSubSection('delivery-sec')}
            >
              {t('tab_delivery')}
            </button>
          </div>

          {/* 1. قسم معدات التغليف */}
          <div id="equipment-sec" className="product-subsection">
            <h2 className="subsection-title-main">{t('sec_equipment_title')}</h2>
            <div className="subsection-underline"></div>

            <div className="products-grid-detailed">
              <ProductCard
                variant="detailed"
                image={strappingRollsImg}
                title={t('eq_strap1_title')}
                desc={t('eq_strap1_desc')}
              />
              <ProductCard
                variant="detailed"
                image={autoStrappingImg}
                title={t('eq_strap2_title')}
                desc={t('eq_strap2_desc')}
              />
              <ProductCard
                variant="detailed"
                image={cartonWrapperImg}
                title={t('eq_wrapper_title')}
                desc={t('eq_wrapper_desc')}
              />
              <ProductCard
                variant="detailed"
                image={continuousSealerImg}
                title={t('eq_sealer_title')}
                desc={t('eq_sealer_desc')}
              />
              <ProductCard
                variant="detailed"
                image={manualPackingImg}
                title={t('eq_manual_title')}
                desc={t('eq_manual_desc')}
              />
              <ProductCard
                variant="detailed"
                image={semiAutoTapingImg}
                title={t('eq_taping_title')}
                desc={t('eq_taping_desc')}
              />
            </div>
          </div>

          {/* 2. قسم مواد التغليف */}
          <div id="materials-sec" className="product-subsection">
            <h2 className="subsection-title-main">{t('sec_materials_title')}</h2>
            <div className="subsection-underline"></div>

            <div className="products-grid-detailed">
              <ProductCard
                variant="detailed"
                image={pofRollsImg}
                title={t('mat_pof_title')}
                desc={t('mat_pof_desc')}
                specs={[t('mat_pof_spec1'), t('mat_pof_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={pvcRollsImg}
                title={t('mat_pvc_title')}
                desc={t('mat_pvc_desc')}
                specs={[t('mat_pvc_spec1'), t('mat_pvc_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={stretchRollsImg}
                title={t('mat_stretch_title')}
                desc={t('mat_stretch_desc')}
                specs={[t('mat_stretch_spec1'), t('mat_stretch_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={strappingCordImg}
                title={t('mat_cord_title')}
                desc={t('mat_cord_desc')}
                specs={[t('mat_cord_spec1'), t('mat_cord_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={clingFilmImg}
                title={t('mat_cling_title')}
                desc={t('mat_cling_desc')}
                specs={[t('mat_cling_spec1'), t('mat_cling_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={vacuumBagsImg}
                title={t('mat_vac_title')}
                desc={t('mat_vac_desc')}
                specs={[t('mat_vac_spec1'), t('mat_vac_spec2')]}
              />
              <ProductCard
                variant="detailed"
                image={adhesiveTapeImg}
                title={t('mat_tape_title')}
                desc={t('mat_tape_desc')}
                specs={[t('mat_tape_spec1'), t('mat_tape_spec2')]}
              />
            </div>
          </div>

          {/* 3. قسم الصيانة والدعم */}
          <div id="maintenance-sec" className="product-subsection service-subsection-block">
            <div className="service-flex-container">
              <div className="service-image-box">
                <img src={supportImg} alt="فريق الصيانة" className="service-illustration-img" />
              </div>
              <div className="service-text-box">
                <h2 className="subsection-title-main">{t('sec_maintenance_title')}</h2>
                <div className="subsection-underline"></div>
                <p className="service-desc-paragraph">{t('maint_p1')}</p>
                <p className="service-desc-paragraph">{t('maint_p2')}</p>
                <div className="service-action-box">
                  <Link to="/contact" className="btn btn-gold">
                    {t('btn_req_maintenance')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4. قسم التوصيل والشحن */}
          <div id="delivery-sec" className="product-subsection service-subsection-block">
            <div className="service-flex-container reverse">
              <div className="service-image-box">
                <img src={deliveryImg} alt="سيارة التوصيل" className="service-illustration-img" />
              </div>
              <div className="service-text-box">
                <h2 className="subsection-title-main">{t('sec_delivery_title')}</h2>
                <div className="subsection-underline"></div>
                <p className="service-desc-paragraph">{t('deliv_p1')}</p>
                <div className="slogan-badge">
                  <FaPhoneVolume /> {t('deliv_slogan')}
                </div>
                <p className="service-desc-paragraph">{t('deliv_p2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Products;
