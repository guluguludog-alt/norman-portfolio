import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent, animate, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './generatedContent.css';

import GProject1 from '../assets/GProject1.png';
import GProject2 from '../assets/GProject2.png';
import GProject3 from '../assets/GProject3.png';
import GProject4 from '../assets/GProject4.png';
import GProject5 from '../assets/GProject5.png';
import GProject6 from '../assets/GProject6.png';

const getProjects = (t) => [
  { id: 1, img: GProject1, title: t('generatedContent.project1') },
  { id: 2, img: GProject2, title: t('generatedContent.project2') },
  { id: 3, img: GProject3, title: t('generatedContent.project3') },
  { id: 4, img: GProject4, title: t('generatedContent.project4') },
  { id: 5, img: GProject5, title: t('generatedContent.project5') },
  { id: 6, img: GProject6, title: t('generatedContent.project6') },
];

/* =========================================
   单张幻灯片组件
   ========================================= */
const GalleryItem = ({ index, smoothProgress, img, spreadProgress, isMobile }) => {
  const originalP = useTransform(smoothProgress, val => {
    let r = ((index - val) % 6 + 6) % 6;
    if (r > 4.5) r -= 6;
    return r;
  });

  const p = useTransform([originalP, spreadProgress], ([orig, spread]) => orig * spread);

  const xDesktop = useTransform(p,   [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['-63vw', '-42vw', '0vw', '42vw', '64vw', '82vw', '96vw', '110vw']);
  const widthDesktop = useTransform(p,  [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['42vw', '42vw', '42vw', '22vw', '18vw', '14vw', '12vw', '12vw']);
  const heightDesktop = useTransform(p, [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['75vh', '75vh', '75vh', '60vh', '45vh', '35vh', '25vh', '25vh']);

  // 🌟 核心优化：将传送锚点进一步拉远至 ±100vw 以上，物理脱离屏幕，完全废弃导致闪烁的 visibility 限制！
  const xMobile = useTransform(p, [-1.5, -1, 0, 1, 2, 3, 4.5], ['-100vw', '-21.3vw', '30vw', '42.5vw', '53.7vw', '66.3vw', '130vw']);
  const widthMobile = useTransform(p, [-1.5, -1, 0, 1, 2, 3, 4.5], ['42.5vw', '42.5vw', '42.5vw', '37.5vw', '32.4vw', '27.5vw', '22.5vw']);
  
  // 透明度控制扩大缓冲区，确保无缝衔接
  const opacityMobile = useTransform(p, [-1.5, -1.0, 3.5, 4.5], [0, 1, 1, 0]);

  const x = isMobile ? xMobile : xDesktop;
  const width = isMobile ? widthMobile : widthDesktop;
  const height = isMobile ? undefined : heightDesktop;
  const opacity = isMobile ? opacityMobile : 1; 

  const zIndexDesktop = useTransform(originalP, val => Math.round((20 - val) * 100));
  const zIndexMobile = useTransform(originalP, val => Math.round((20 - val) * 100));
  const zIndex = isMobile ? zIndexMobile : zIndexDesktop;

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        bottom: isMobile ? 'auto' : 0, 
        top: isMobile ? '50%' : 'auto',
        y: isMobile ? '-50%' : 0,
        left: 0,   
        x,           
        width, 
        height,
        zIndex,
        opacity, // 完全交由 opacity 接管显隐
        contain: isMobile ? 'layout style' : 'strict',
        willChange: 'transform, opacity' // 仅让 GPU 代理 Transform 和 Opacity，极其流畅
      }}
    >
      <img 
        src={img} 
        alt={`Project ${index + 1}`} 
        loading="lazy" // 🌟 核心：通知浏览器智能预加载
        decoding="async" 
        style={{ width: '100%', height: isMobile ? 'auto' : '100%', objectFit: isMobile ? undefined : 'cover', display: 'block', pointerEvents: 'none' }} 
        draggable="false"
      />
    </motion.div>
  );
};

/* =========================================
   主组件
   ========================================= */
export default function GeneratedContent() {
  const { t, i18n } = useTranslation();
  const isChinese = i18n.language === 'zh';
  const projects = getProjects(t);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const [isMobile, setIsMobile] = useState(isMobileRef.current);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      if (mobile !== isMobileRef.current) {
        isMobileRef.current = mobile;
        setIsMobile(mobile);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress: sectionVisibleProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });

  const [showPill, setShowPill] = useState(false);
  
  useMotionValueEvent(sectionVisibleProgress, "change", (latest) => {
    if (isMobileRef.current) {
      if (latest >= 0.98 && !showPill) setShowPill(true);
      if (latest < 0.90 && showPill) setShowPill(false);
    }
  });

  const [triggerPoint, setTriggerPoint] = useState(999999);

  useLayoutEffect(() => {
    if (isMobileRef.current) return;
    const updatePoint = () => {
      if (sectionRef.current) setTriggerPoint(sectionRef.current.offsetTop);
    };
    updatePoint();
    window.addEventListener('resize', updatePoint);
    return () => window.removeEventListener('resize', updatePoint);
  }, []);

  const { scrollY } = useScroll();
  
  const { scrollYProgress: galleryEnterProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });
  const spreadProgress = useTransform(galleryEnterProgress, [0.5, 1], [0, 1]);

  const rawProgress = useMotionValue(0); 
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 15 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const dragRef = useRef({ 
    isDown: false, startX: 0, startY: 0, startP: 0, 
    lastTime: 0, lastX: 0, velocity: 0, axis: null 
  });
  const inertiaRef = useRef(null);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const index = ((Math.round(latest) % 6) + 6) % 6;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        inertiaRef.current?.stop(); 
        rawProgress.set(rawProgress.get() + e.deltaX * 0.0015);
      }
    };

    const handleTouchMove = (e) => {
      if (dragRef.current.axis === 'x') {
        if (e.cancelable) e.preventDefault();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [rawProgress]);

  const onPointerDown = (e) => {
    inertiaRef.current?.stop(); 
    dragRef.current = { 
      isDown: true, startX: e.clientX, startY: e.clientY, startP: rawProgress.get(), 
      lastTime: Date.now(), lastX: e.clientX, velocity: 0, axis: null 
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (!dragRef.current.axis) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragRef.current.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
    }

    if (dragRef.current.axis === 'y') return;

    const sensitivity = isMobile ? 0.0035 : 0.002;
    rawProgress.set(dragRef.current.startP - dx * sensitivity);

    const now = Date.now();
    if (now - dragRef.current.lastTime > 16) {
      const dt = now - dragRef.current.lastTime;
      dragRef.current.velocity = (e.clientX - dragRef.current.lastX) / dt;
      dragRef.current.lastTime = now;
      dragRef.current.lastX = e.clientX;
    }
  };

  const onPointerUp = () => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    
    if (dragRef.current.axis === 'y') return;

    const velocity = dragRef.current.velocity;
    const targetP = rawProgress.get() - velocity * (isMobile ? 0.25 : 0.4);
    
    inertiaRef.current = animate(rawProgress.get(), targetP, {
      type: "spring", stiffness: isMobile ? 160 : 120, damping: isMobile ? 22 : 18,
      onUpdate: v => rawProgress.set(v)
    });
  };

  useEffect(() => {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('touchcancel', onPointerUp);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('touchcancel', onPointerUp);
    };
  }, [isMobile]); 

  return (
    <motion.section 
      id="generated-content" 
      className={`generated-content-page${isChinese ? ' zh-lang' : ''}`}
      ref={sectionRef}
      style={{ y: 0, z: 0, willChange: 'transform' }} 
    >
      <div className="gc-title-block">
        <div className="gc-blue-square"></div>
        <AnimatePresence mode="wait">
          <motion.h2 
            key={activeIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="gc-title-text"
            style={{ willChange: 'opacity, transform' }}
          >
            {projects[activeIndex].title}
          </motion.h2>
        </AnimatePresence>
      </div>

      <div className="gc-carousel-container" ref={containerRef} onPointerDown={onPointerDown}>
        {projects.map((proj, i) => (
          <GalleryItem key={proj.id} index={i} smoothProgress={smoothProgress} img={proj.img} spreadProgress={spreadProgress} isMobile={isMobile} />
        ))}
      </div>

      <div className="gc-hint-wrapper">
        <AnimatePresence>
          {isMobile && showPill && (
            <motion.div
              initial={{ width: 0, opacity: 0, scale: 0.8 }}
              animate={{ width: "auto", opacity: 1, scale: 1 }}
              exit={{ width: 0, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, opacity: { duration: 0.2 } }}
              className="gc-pill-button"
            >
              <span className="gc-pill-text">
                {isChinese ? "左右滑动浏览更多项目照片" : "Swipe through the gallery to view more pictures"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}