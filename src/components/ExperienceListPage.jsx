import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './experienceListPage.css';
import starBg from '../assets/Starbackground.png'; 

const CompanyItem = React.memo(({ company, index, scrollYProgress, isActive, onClick }) => {
  // 使用 hasActivated 记录是否曾经被激活过，以便触发回退动画
  const [hasActivated, setHasActivated] = useState(false);

  useEffect(() => {
    if (isActive) setHasActivated(true);
  }, [isActive]);
  
  const opacityStart = index * 0.12; 
  const opacityEnd = opacityStart + 0.15; 
  const itemOpacity = useTransform(scrollYProgress, [opacityStart, opacityEnd], [0, 1]);

  const sweepStart = opacityStart + 0.1; 
  const sweepEnd = sweepStart + 0.4; 
  const percent = useTransform(scrollYProgress, [sweepStart, sweepEnd], [-20, 120]);

  const stop1 = useTransform(percent, v => `${v - 15}%`); 
  const stop2 = useTransform(percent, v => `${v - 5}%`);  
  const stop3 = useTransform(percent, v => `${v}%`);      
  const stop4 = useTransform(percent, v => `${v + 10}%`); 

  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #8599d2 ${stop2}, #0016d8 ${stop3}, rgba(255, 255, 255, 0.25) ${stop4})`;

  // ================= 核心动画编排 =================
  
  const originalTextVariants = {
    hidden: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
    rest: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      scale: 1, 
      transition: { 
        clipPath: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.4, ease: "easeOut" } 
      } 
    },
    hover: { 
      clipPath: "inset(0% 0% 0% 100%)", 
      scale: 1.05, 
      transition: { 
        scale: { duration: 0.7, ease: "easeInOut" },
        clipPath: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] } 
      } 
    }
  };

  const revealTextVariants = {
    hidden: { clipPath: "inset(0% 100% 0% 0%)" },
    rest: { 
      clipPath: "inset(0% 100% 0% 0%)", 
      transition: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] } 
    },
    hover: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      transition: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  const scannerVariants = {
    hidden: { opacity: 0, left: "0%" },
    rest: {
      left: "0%",
      opacity: 0, 
      boxShadow: "25px 0 30px 6px rgba(0, 130, 255, 0.9), 70px 0 80px 16px rgba(82, 17, 221, 0.8), 140px 0 130px 28px rgba(0, 22, 216, 0.5)",
      transition: {
        left: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] },
        boxShadow: { duration: 0 },
        opacity: { duration: 0.35, delay: 0.5, ease: "easeOut" }
      }
    },
    hover: {
      left: "100%",
      opacity: 1,
      boxShadow: "-25px 0 30px 6px rgba(0, 130, 255, 0.9), -70px 0 80px 16px rgba(82, 17, 221, 0.8), -140px 0 130px 28px rgba(0, 22, 216, 0.5)",
      transition: {
        left: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] },
        boxShadow: { duration: 0, delay: 0.7 },
        opacity: { duration: 0.15, delay: 0.7, ease: "easeIn" }
      }
    }
  };

  // 🌟 根据属性直接判定当前应处于哪种动画状态
  const currentAnimationState = isActive ? "hover" : (hasActivated ? "rest" : "hidden");

  return (
    <motion.div 
      className="company-item"
      style={{ opacity: itemOpacity }} 
      onClick={onClick} /* 🌟 核心：Hover 改为 onClick */
      initial="hidden"
      animate={currentAnimationState}
    >
      <div className="company-text-wrapper">
        
        <motion.div 
          className="company-text-mask original-text"
          style={{ backgroundImage: animatedGradient }} 
          variants={originalTextVariants}
        >
          {company.name.trim()}
        </motion.div>

        <motion.div 
          className="company-text-mask reveal-text"
          variants={revealTextVariants}
        >
          <div className="reveal-content">
            <span className="intern-position">{company.position.trim()}</span>
            {company.time && <span className="intern-time">{company.time}</span>}
          </div>
        </motion.div>

        <motion.div 
          className="comet-scanner"
          variants={scannerVariants}
        />
        
      </div>
    </motion.div>
  );
});

export default function ExperienceListPage() {
  const containerRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language === 'zh';
  
  // 🌟 核心状态：记录当前展开的是哪个索引。null 代表全部关闭。
  const [activeIndex, setActiveIndex] = useState(null);

  // ---- Mobile pill state (touch devices only) ----
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showPill, setShowPill] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const { scrollYProgress: pillProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  useEffect(() => {
    const unsubscribe = pillProgress.on("change", (latest) => {
      setShowPill(latest >= 0.2 && latest <= 0.95);
    });
    return unsubscribe;
  }, [pillProgress]);

  const { scrollYProgress: textScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(bgScrollProgress, [0, 1], ["-10%", "10%"]);

  const companies = [
    { name: t('experienceList.company1'), position: t('experienceList.position1'), time: t('experienceList.time1') },
    { name: t('experienceList.company2'), position: t('experienceList.position2'), time: t('experienceList.time2') },
    { name: t('experienceList.company3'), position: t('experienceList.position3'), time: t('experienceList.time3') },
    { name: t('experienceList.company4'), position: t('experienceList.position4'), time: t('experienceList.time4') },
    { name: t('experienceList.company5'), position: t('experienceList.position5'), time: t('experienceList.time5') }
  ];

  return (
    <section 
      id="experience-list" 
      className="experience-list-page"
      ref={containerRef}
    >
      <motion.div 
        className="parallax-star-bg"
        style={{ 
          y: bgY,
          backgroundImage: `url(${starBg})` 
        }}
      />

      <div className="company-list-container" style={isChinese ? { '--zh-font-size': 'clamp(2.6rem, 3vw, 3.2rem)', '--zh-letter-spacing': '0.15em' } : {}}>
        {companies.map((company, index) => (
          <CompanyItem 
            key={index}
            index={index}
            company={company}
            scrollYProgress={textScrollProgress}
            isActive={activeIndex === index} 
            onClick={() => setActiveIndex(activeIndex === index ? null : index)} /* 🌟 触发点击事件 */
          />
        ))}
      </div>
      {/* Mobile floating pill (touch devices only) */}
      <AnimatePresence>
        {isTouchDevice && showPill && (
          <div className="mobile-experience-pill">
            <motion.div
              className="mobile-experience-pill-inner"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.8 }}
            >
              {t('experienceList.pillText')}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
