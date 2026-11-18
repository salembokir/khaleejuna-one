import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Login from './pages/Login';

const ToastManager = () => {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          fontFamily: "'Cairo', sans-serif",
          fontSize: '0.95rem',
          fontWeight: 600,
          padding: '13px 20px',
          borderRadius: '12px',
          border: '1.8px solid #b9935a',
          background: '#ffffff',
          color: '#083325',
          boxShadow: '0 10px 25px rgba(185, 147, 90, 0.22), 0 4px 10px rgba(0, 0, 0, 0.05)',
        },
        success: {
          iconTheme: {
            primary: '#b9935a',
            secondary: '#ffffff',
          },
          style: {
            border: '1.8px solid #b9935a',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
          style: {
            border: '1.8px solid #f87171',
          },
        },
      }}
    />
  );
};

function App() {
  return (
    <LanguageProvider>
      <ToastManager />
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            {/* Catch-all redirects back to Home */}
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
