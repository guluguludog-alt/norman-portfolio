import React, { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { useTranslation } from 'react-i18next';
import Aurora from './AuroraEffect'; 
import MailIcon from '../assets/Mailicon.png';
import './contactPage.css';

export default function ContactPage() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const lenis = useLenis();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      // Fallback: try to find Lenis instance on window
      const globalLenis = window.__lenis;
      if (globalLenis) {
        globalLenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [lenis]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const text = "LETUSTALK!";
  const letters = text.split("");

  const finalScales = [4.6, 5.5, 4.0, 6.2, 5.1, 5.2, 4.4, 5.9, 4.7, 5.7];

  return (
    <section id="contact" className="contact-section" ref={containerRef}>
      
      {/* 极光背景层 */}
      <div className="contact-aurora-bottom">
        <Aurora
          colorStops={["#2457e4", "#0016d8", "#5211dd"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      <div className="contact-banner-wrapper">
        {letters.map((char, i) => {
          const scaleY = useTransform(
            scrollYProgress, 
            [0, 0.75], 
            [1, finalScales[i] || 2.5] 
          );

          return (
            <motion.span
              key={i}
              style={{ scaleY, display: 'inline-block', transformOrigin: '50% 0%' }}
              className="contact-letter"
            >
              {char}
            </motion.span>
          );
        })}
      </div>
      
      {/* 居中玻璃卡片 */}
      <div className="contact-glass-card">
        <div className="contact-content-grid">
          {/* 左侧：社交媒体 */}
          <div className="contact-col">
            <h3 className="contact-heading">Social media</h3>
            <div className="contact-links-group">
              <a href="https://xhslink.com/m/1Qv29wgfROD" target="_blank" rel="noopener noreferrer" className="contact-link">Rednote</a>
              <a href="https://www.instagram.com/metropolink?igsh=d2dwNm9mbThyMTZy&utm_source=qr" target="_blank" rel="noopener noreferrer" className="contact-link">Instagram</a>
            </div>
          </div>

          {/* 分割线 */}
          <div className="contact-divider"></div>

          {/* 右侧：邮箱 */}
          <div className="contact-col">
            <h3 className="contact-heading">E-mail</h3>
            <div className="contact-links-group">
              <a href="mailto:citiesxl@hotmail.com" className="contact-link">citiesxl@hotmail.com</a>
              <a href="mailto:citiesxl@hotmail.com" className="mail-icon-link">
                <img src={MailIcon} alt="Mail" className="contact-mail-icon" />
              </a>
            </div>
          </div>
        </div>

        {/* Back to Top 按钮 */}
        <button
          className="contact-back-to-top"
          onClick={scrollToTop}
        >
          {t('contact.backToTop')}
        </button>
      </div>

      {/* Footer 信息 */}
      <div className="contact-footer">
        <div className="footer-left">©NormanLiu</div>
        <div className="footer-center">2026</div>
        <div className="footer-right">Sichuan<br/>China</div>
      </div>

    </section>
  );
}