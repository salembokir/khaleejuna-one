// ==========================================================================
// KHALIJEUNA WAHID - PRODUCTS PAGE JAVASCRIPT (products.js)
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

    // 3. التمرير للأقسام الفرعية بصفحة المنتجات (Sub-sections in products.html)
    window.scrollToSubSection = (subSectionId) => {
        const subSection = document.getElementById(subSectionId);
        if (subSection) {
            subSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            updateTabState(subSectionId);
        }
    };

    function updateTabState(subSectionId) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            const onClickAttr = btn.getAttribute('onclick');
            if (onClickAttr && onClickAttr.includes(subSectionId)) {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
        });
    }

    // إذا تم فتح الصفحة مع هاش محدد (مثل products.html#materials-sec)
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        setTimeout(() => {
            const targetEl = document.getElementById(hashId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateTabState(hashId);
            }
        }, 200);
    }

    // مراقبة حركة التمرير لتحديث تبويبات المنتجات تلقائياً
    const productSubSections = document.querySelectorAll('.product-subsection');
    if (productSubSections.length > 0) {
        window.addEventListener('scroll', () => {
            let currentSecId = '';
            const scrollPos = window.scrollY + 180;
            
            productSubSections.forEach(sec => {
                const secTop = sec.offsetTop;
                const secHeight = sec.offsetHeight;
                if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                    currentSecId = sec.getAttribute('id');
                }
            });
            
            if (currentSecId) {
                updateTabState(currentSecId);
            }
        });
    }
});
