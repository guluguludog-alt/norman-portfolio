import React, { useState } from 'react'; 
import GlassSurface from './GlassSurface'; 
import './Navbar.css';
import MenuIcon from '../assets/MenuIcon.png';
import { motion, AnimatePresence } from 'framer-motion';

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
              <a href="#aigc">AIGC</a>
              <a href="#architecture">Architecture</a>
              <a href="#landscape">Landscape</a>
              <a href="#myspace">More</a>
            </nav>
          </GlassSurface>
        </header>

        {/* 右侧独立按钮组 (语言切换和 Contact me) */}
        <div className="right-nav-group">
          <button className="lang-btn">中文</button>
          <a 
            href="#contact" 
            className="contact-btn"
          >
            Contact me
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
                backgroundColor: '#0016d8', /* 🌟 这里已改为你要求的 #0016d8 */
                zIndex: 1999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <nav className="mobile-fullscreen-nav-links">
                {[
                  { name: 'AIGC', href: '#aigc' },
                  { name: 'Architecture', href: '#architecture' },
                  { name: 'Landscape', href: '#landscape' },
                  { name: 'More', href: '#myspace' },
                  { name: '中文', isButton: true },
                  { name: 'Contact me', href: '#contact' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={linkVariants}>
                    {item.isButton ? (
                      <button className="mobile-fullscreen-link" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</button>
                    ) : (
                      <a href={item.href} className="mobile-fullscreen-link" onClick={() => setIsMobileMenuOpen(false)}>{item.name}</a>
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