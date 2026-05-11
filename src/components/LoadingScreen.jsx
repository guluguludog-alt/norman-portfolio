import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './loadingScreen.css';

// =========================================
// 1. 引入你需要强制等待加载的大图
// =========================================
import avatarImg from '../assets/avatar.png';
import ringImg from '../assets/Ring.png';
import starBg from '../assets/Starbackground.png';

// 建筑画廊图片
import Project1 from '../assets/Project1.jpg';
import Project2 from '../assets/Project2.jpg';
import Project3 from '../assets/Project3.jpg';
import Project4 from '../assets/Project4.jpg';
import Project5 from '../assets/Project5.jpg';

// 景观画廊图片
import LProject1 from '../assets/LProject1.png';
import LProject2 from '../assets/LProject2.png';
import LProject3 from '../assets/LProject3.png';
import LProject4 from '../assets/LProject4.png';
import LProject5 from '../assets/LProject5.png';

// GeneratedContent 页面图片
import GProject1 from '../assets/GProject1.png';
import GProject2 from '../assets/GProject2.png';
import GProject3 from '../assets/GProject3.png';
import GProject4 from '../assets/GProject4.png';
import GProject5 from '../assets/GProject5.png';
import GProject6 from '../assets/GProject6.png';

const PRELOAD_ASSETS = [
  '/background_layer.png',
  '/pixel_layer.png',
  avatarImg, ringImg, starBg,
  Project1, Project2, Project3, Project4, Project5,
  LProject1, LProject2, LProject3, LProject4, LProject5,
  GProject1, GProject2, GProject3, GProject4, GProject5, GProject6
];

// 🌟 核心突破口：将图片实例挂载到 Window 全局对象上，彻底阻断浏览器的垃圾回收机制！
window.__PRELOADED_IMAGES_CACHE__ = window.__PRELOADED_IMAGES_CACHE__ || [];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let currentProgress = 0;
    let loadedCount = 0;
    const total = PRELOAD_ASSETS.length;

    const simInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress > 85) currentProgress = 85; 
      if (isMounted) setProgress(currentProgress);
    }, 150);

    const handleComplete = () => {
      clearInterval(simInterval);
      if (isMounted) {
        setProgress(100); 
        setTimeout(() => {
          setIsVisible(false);
          if (onComplete) onComplete();
        }, 400); 
      }
    };

    if (total === 0) {
      handleComplete();
    } else {
      PRELOAD_ASSETS.forEach((src) => {
        const img = new Image();
        img.src = src;
        
        const markAsLoaded = () => {
          // 🌟 把解码后的图片塞进全局数组，永久驻留极速内存
          window.__PRELOADED_IMAGES_CACHE__.push(img);
          loadedCount++;
          if (loadedCount === total) handleComplete();
        };

        // 🌟 强制调用底层 decode()，将压缩包提前解压为 GPU 显存可以直读的位图
        if (img.decode) {
          img.decode().then(markAsLoaded).catch(markAsLoaded);
        } else {
          img.onload = markAsLoaded;
          img.onerror = markAsLoaded;
        }
      });
    }

    return () => {
      isMounted = false;
      clearInterval(simInterval);
    };
  }, [onComplete]);

  const columns = isDesktop ? [0, 1, 2, 3] : [0];

  const colVariants = {
    initial: { y: 0 },
    exit: (custom) => {
      const staggerDelay = custom.isDesktop ? (3 - custom.index) * 0.12 : 0;
      return {
        y: '-100vh',
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.25 + staggerDelay }
      };
    }
  };

  const contentVariants = {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="loading-screen" exit="exit" initial="initial">
          <div className="loading-bg-wrapper">
            {columns.map((i) => (
              <motion.div key={i} className="loading-col" variants={colVariants} custom={{ index: i, isDesktop }} />
            ))}
          </div>
          <motion.div className="loading-content-wrapper" variants={contentVariants}>
            <div className="loading-content">
              <h1 className="loading-name">Norman Liu</h1>
              <p className="loading-percentage">{progress}%</p>
            </div>
            <div className="loading-bar-container">
              <motion.div className="loading-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.15 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}