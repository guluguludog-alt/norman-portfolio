import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionValueEvent, animate, AnimatePresence } from 'framer-motion';
import './generatedContent.css';

import GProject1 from '../assets/GProject1.png';
import GProject2 from '../assets/GProject2.png';
import GProject3 from '../assets/GProject3.png';
import GProject4 from '../assets/GProject4.png';
import GProject5 from '../assets/GProject5.png';
import GProject6 from '../assets/GProject6.png';

const projects = [
  { id: 1, img: GProject1, title: "Conceptual rendering of a smart factory" },
  { id: 2, img: GProject2, title: "Commercial complex rendering" },
  { id: 3, img: GProject3, title: "Bus terminal facade rendering" },
  { id: 4, img: GProject4, title: "High-rise mixed-use complex rendering" },
  { id: 5, img: GProject5, title: "Cyberpunk-style smart city poster" },
  { id: 6, img: GProject6, title: "Bus transfer center rendering" },
];

/* =========================================
   单张幻灯片组件（保留了性能优化）
   ========================================= */
const GalleryItem = ({ index, smoothProgress, img, spreadProgress }) => {
  const originalP = useTransform(smoothProgress, val => {
    let r = ((index - val) % 6 + 6) % 6;
    if (r > 4.5) r -= 6;
    return r;
  });

  const p = useTransform([originalP, spreadProgress], ([orig, spread]) => orig * spread);

  const x = useTransform(p,   [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['-63vw', '-42vw', '0vw', '42vw', '64vw', '82vw', '96vw', '110vw']);
  const width = useTransform(p,  [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['42vw', '42vw', '42vw', '22vw', '18vw', '14vw', '12vw', '12vw']);
  const height = useTransform(p, [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['75vh', '75vh', '75vh', '60vh', '45vh', '35vh', '25vh', '25vh']);
  const zIndex = useTransform(originalP, val => Math.round(10 - val));

  const visibility = useTransform(p, val => (val < -1.6 || val > 4.6) ? 'hidden' : 'visible');

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0,   
        x,           
        width, 
        height, 
        zIndex,
        visibility,
        opacity: 1, 
        z: 0, // 🌟 性能优化：给每个图层独立的 GPU 通道
        contain: 'strict', // 防止影响外部重绘
        willChange: 'transform, width, height'
      }}
    >
      <img 
        src={img} 
        alt={`Project ${index + 1}`} 
        decoding="async" // 🌟 性能优化：强制后台解码，防主线程卡顿
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
        draggable="false"
      />
    </motion.div>
  );
};

/* =========================================
   主组件
   ========================================= */
export default function GeneratedContent() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  
  // 🌟 恢复：计算触发页面 Q弹吸附 的 Y 轴阀值
  const [triggerPoint, setTriggerPoint] = useState(999999);

  useLayoutEffect(() => {
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

  // 🌟 恢复：页面的惯性移动效果逻辑
  const clampedScrollY = useTransform(scrollY, (y) => Math.min(y, triggerPoint));
  const smoothClampedScrollY = useSpring(clampedScrollY, { stiffness: 100, damping: 30 });
  const springOffset = useTransform(() => clampedScrollY.get() - smoothClampedScrollY.get());

  const rawProgress = useMotionValue(0); 
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 15 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const dragRef = useRef({ isDown: false, startX: 0, startP: 0, lastTime: 0, lastX: 0, velocity: 0 });
  const inertiaRef = useRef(null);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const index = ((Math.round(latest) % 6) + 6) % 6;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        inertiaRef.current?.stop(); 
        rawProgress.set(rawProgress.get() + e.deltaX * 0.0015);
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, [rawProgress]);

  const onPointerDown = (e) => {
    inertiaRef.current?.stop(); 
    dragRef.current = { 
      isDown: true, startX: e.clientX, startP: rawProgress.get(), 
      lastTime: Date.now(), lastX: e.clientX, velocity: 0 
    };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.isDown) return;
    const dx = e.clientX - dragRef.current.startX;
    
    rawProgress.set(dragRef.current.startP - dx * 0.002);

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
    
    const velocity = dragRef.current.velocity;
    const targetP = rawProgress.get() - velocity * 0.4;
    
    inertiaRef.current = animate(rawProgress.get(), targetP, {
      type: "spring", stiffness: 120, damping: 18,
      onUpdate: v => rawProgress.set(v)
    });
  };

  useEffect(() => {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <motion.section 
      id="generated-content" 
      className="generated-content-page"
      ref={sectionRef}
      style={{ 
        y: springOffset, /* 🌟 恢复的页面整体惯性阻尼移动效果 */
        z: 0, 
        willChange: 'transform' 
      }} 
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

      <div 
        className="gc-carousel-container"
        ref={containerRef}
        onPointerDown={onPointerDown}
      >
        {projects.map((proj, i) => (
          <GalleryItem 
            key={proj.id} 
            index={i} 
            smoothProgress={smoothProgress} 
            img={proj.img}
            spreadProgress={spreadProgress}
          />
        ))}
      </div>
    </motion.section>
  );
}