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
  { id: 2, img: GProject2, title: "Architectural rendering of a bus terminal" },
  { id: 3, img: GProject3, title: "Bus terminal facade rendering" },
  { id: 4, img: GProject4, title: "High-rise mixed-use complex rendering" },
  { id: 5, img: GProject5, title: "Cyberpunk-style smart city poster" },
  { id: 6, img: GProject6, title: "Bus transfer center rendering" },
];

/* =========================================
   单张幻灯片组件
   ========================================= */
const GalleryItem = ({ index, smoothProgress, img, spreadProgress }) => {
  // 将无限滚动的 progress 映射为 -1.5 到 4.5 的连续值
  const originalP = useTransform(smoothProgress, val => {
    let r = ((index - val) % 6 + 6) % 6;
    if (r > 4.5) r -= 6;
    return r;
  });

  // 入场散开动画：spreadProgress 从 0→1 时，图片从堆叠状态散开到正常位置
  const p = useTransform([originalP, spreadProgress], ([orig, spread]) => orig * spread);

  const left = useTransform(p,   [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['-63vw', '-42vw', '0vw', '42vw', '64vw', '82vw', '96vw', '110vw']);
  const width = useTransform(p,  [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['42vw', '42vw', '42vw', '22vw', '18vw', '14vw', '12vw', '12vw']);
  const height = useTransform(p, [-1.5, -1, 0, 1, 2, 3, 4, 4.5], ['75vh', '75vh', '75vh', '60vh', '45vh', '35vh', '25vh', '25vh']);
  // zIndex 基于原始排布位置，不受散开动画影响，避免层级跳变
  const zIndex = useTransform(originalP, val => Math.round(10 - val));

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left, width, height, zIndex,
        opacity: 1, 
        willChange: 'transform, width, height, left'
      }}
    >
      <img 
        src={img} 
        alt={`Project ${index + 1}`} 
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
  
  // ===========================================
  // 页面覆盖缓冲截断逻辑
  // ===========================================
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
  
  // 画廊散开动画：页面从 50% 可见到 100% 可见期间，图片从堆叠向右散开
  const { scrollYProgress: galleryEnterProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"]
  });
  const spreadProgress = useTransform(galleryEnterProgress, [0.5, 1], [0, 1]);

  const clampedScrollY = useTransform(scrollY, (y) => Math.min(y, triggerPoint));
  const smoothClampedScrollY = useSpring(clampedScrollY, { stiffness: 100, damping: 30 });
  const springOffset = useTransform(() => clampedScrollY.get() - smoothClampedScrollY.get());

  // ===========================================
  // 无限轮播物理逻辑
  // ===========================================
  const rawProgress = useMotionValue(0); 
  const smoothProgress = useSpring(rawProgress, { stiffness: 80, damping: 15 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const dragRef = useRef({ isDown: false, startX: 0, startP: 0, lastTime: 0, lastX: 0, velocity: 0 });
  const inertiaRef = useRef(null);
  const autoScrollRef = useRef(null);
  const userInteractingRef = useRef(false);

  // 画廊散开动画完成后，启动缓慢自动轮播
  useEffect(() => {
    const unsub = spreadProgress.on("change", (v) => {
      if (v >= 1 && !userInteractingRef.current) {
        autoScrollRef.current?.stop();
        autoScrollRef.current = animate(rawProgress.get(), rawProgress.get() + 9999, {
          duration: 9999 / 0.03, // 极慢速自动轮播
          ease: "linear",
          onUpdate: (v) => {
            if (!userInteractingRef.current) rawProgress.set(v);
          },
        });
      }
    });
    return () => {
      unsub();
      autoScrollRef.current?.stop();
    };
  }, [rawProgress, spreadProgress]);

  // 用户交互时停止自动轮播
  const stopAutoScroll = () => {
    userInteractingRef.current = true;
    autoScrollRef.current?.stop();
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const index = ((Math.round(latest) % 6) + 6) % 6;
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  // 滚轮滑动支持
  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        stopAutoScroll();
        rawProgress.set(rawProgress.get() + e.deltaX * 0.0015);
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, [rawProgress]);

  // 拖拽控制
  const onPointerDown = (e) => {
    stopAutoScroll();
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
      style={{ y: springOffset }} 
    >
      {/* 动态标题模块 */}
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
          >
            {projects[activeIndex].title}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* 无限循环画廊容器 */}
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