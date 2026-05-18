import React, { useState, useRef, useEffect } from 'react'; 
import GlassSurface from './GlassSurface'; 
import './Navbar.css';
import MenuIcon from '../assets/MenuIcon.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const menuVariants = {
  hidden: { y: '-100%', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  visible: { 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.15
    } 
  }
};

const linkVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

export default function Navbar() { 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);
  const moreDropdownRef = useRef(null);
  const moreTriggerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target) &&
          moreTriggerRef.current && !moreTriggerRef.current.contains(e.target)) {
        setIsMoreHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. Desktop Layout */}
      <div className="desktop-nav">
        {/* 导航栏容器（液态玻璃） */}
        <header className="navbar-wrapper">
          <GlassSurface 
            width="800px"       
            height="40px"       
            borderRadius={30}   
            blur={15}           
            opacity={0.8}       
            className="navbar-glass" 
          >
            <nav className="nav-links">
              <a href="#aigc">{t('navbar.aigc')}</a>
              <a href="#architecture">{t('navbar.architecture')}</a>
              <a href="/resources" onClick={(e) => { e.preventDefault(); navigate('/resources'); }}>{t('navbar.landscape')}</a>
              <div 
                className="more-dropdown-wrapper"
                onMouseEnter={() => setIsMoreHovered(true)}
                onMouseLeave={() => setIsMoreHovered(false)}
              >
                <a href="#myspace" ref={moreTriggerRef} onClick={(e) => e.preventDefault()}>{t('navbar.more')}</a>
                <AnimatePresence>
                  {isMoreHovered && (
                    <motion.div
                      ref={moreDropdownRef}
                      className="more-dropdown-menu"
                      initial={{ opacity: 0, y: -10, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: -10, x: '-50%' }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <a href="#programming" className="more-dropdown-item" onClick={() => setIsMoreHovered(false)}>Vibe-Coding</a>
                      <a href="#myspace" className="more-dropdown-item" onClick={() => setIsMoreHovered(false)}>My Space</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </GlassSurface>
        </header>

        {/* 右侧独立按钮组 (语言切换和 Contact me) */}
        <div className="right-nav-group">
          <button className="lang-btn" onClick={toggleLanguage}>
            {i18n.language === 'en' ? '中文' : 'EN'}
          </button>
          <a 
            href="#contact" 
            className="contact-btn"
          >
            {t('navbar.contactMe')}
          </a>
        </div>
      </div>

      {/* 2. Mobile Layout */}
      <div className="mobile-nav">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <img src={MenuIcon} alt="Menu" />
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="mobile-fullscreen-menu"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={menuVariants}
              style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: '#0016d8',
                zIndex: 1999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <nav className="mobile-fullscreen-nav-links">
                {[
                  { name: t('navbar.aigc'), href: '#aigc' },
                  { name: t('navbar.architecture'), href: '#architecture' },
                  { name: t('navbar.landscape'), href: '/resources', navigateTo: '/resources' },
                  { name: t('navbar.more'), href: '#myspace' },
                  { name: i18n.language === 'en' ? '中文' : 'EN', isButton: true },
                  { name: t('navbar.contactMe'), href: '#contact' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={linkVariants}>
                    {item.isButton ? (
                      <button className="mobile-fullscreen-link" onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}>{item.name}</button>
                    ) : (
                      <a href={item.href} className="mobile-fullscreen-link" onClick={() => { setIsMobileMenuOpen(false); if (item.navigateTo) { navigate(item.navigateTo); } }}>{item.name}</a>
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}