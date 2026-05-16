import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence, useMotionValue, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSticker from './AnimatedSticker'; 
import './mySpaceListPage.css';

import CatStickerImg from '../assets/CatSticker1.png';
import EyesStickerImg from '../assets/EyesSticker.png';

import Cat1Img from '../assets/Cat1.jpg';
import Cat2Img from '../assets/Cat2.jpg';
import Cat3Img from '../assets/Cat3.jpg';
import Cat4Img from '../assets/Cat4.jpg';
import Cat5Img from '../assets/Cat5.jpg';
import Friends1Img from '../assets/Friends1.jpg';
import Friends2Img from '../assets/Friends2.jpg';
import Friends3Img from '../assets/Friends3.jpg';
import Friends4Img from '../assets/Friends4.jpg';
import Music1Img from '../assets/Music1.jpg';
import Music2Img from '../assets/Music2.jpg';
import Music3Img from '../assets/Music3.jpg';
import Music4Img from '../assets/Music4.jpg';
import Music5Img from '../assets/Music5.jpg';
import Movie1Img from '../assets/Movie1.jpg';
import Movie2Img from '../assets/Movie2.jpg';
import Movie3Img from '../assets/Movie3.jpg';
import Movie4Img from '../assets/Movie4.jpg';
import GamesImg from '../assets/Games.jpg';
import Books1Img from '../assets/Books1.jpg';
import Books2Img from '../assets/Books2.jpg';

const AnimatedLine = ({ lineData, index, totalLines, scrollYProgress, isActive, isTouchRef, updatePos, onHover, onClick }) => {
  const animStart = 0.2;
  const animEnd = 1.0; 
  const duration = animEnd - animStart;
  const step = duration / totalLines;
  const start = animStart + index * step * 0.7; 
  const end = Math.min(start + step * 1.5, 1); 

  const percent = useTransform(scrollYProgress, [start, end], [-20, 120]);

  const stop1 = useTransform(percent, v => `${v - 15}%`); 
  const stop2 = useTransform(percent, v => `${v - 5}%`);  
  const stop3 = useTransform(percent, v => `${v}%`);      
  const stop4 = useTransform(percent, v => `${v + 10}%`); 

  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #ffffff ${stop2}, #0016d8 ${stop3}, rgba(0, 22, 216, 0) ${stop4})`;

  // ================= 鼠标专属：Hover 触发逻辑 =================
  const handlePointerEnter = (e) => {
    if (isTouchRef.current) return; // 触控设备忽略
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let clickPercent = Math.max(0, Math.min(1, x / rect.width));
    updatePos(e.clientX, e.clientY);
    onHover(index, clickPercent);
  };

  const handlePointerMove = (e) => {
    if (isTouchRef.current) return; 
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let clickPercent = Math.max(0, Math.min(1, x / rect.width));
    updatePos(e.clientX, e.clientY);
    onHover(index, clickPercent);
  };

  const handlePointerLeave = (e) => {
    if (isTouchRef.current) return;
    onHover(null, 0); // 鼠标移开立即消失
  };

  // ================= 触控专属：点击触发逻辑 =================
  const handleClick = (e) => {
    if (!isTouchRef.current) return; // 鼠标设备忽略点击（交由 Hover 处理）
    e.stopPropagation(); // 阻止冒泡到容器的点击事件
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let clickPercent = Math.max(0, Math.min(1, x / rect.width));
    updatePos(e.clientX, e.clientY);
    onClick(index, clickPercent);
  };

  return (
    <motion.h1 
      className="myspace-text-line" 
      style={{ backgroundImage: animatedGradient }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <span className="myspace-main-text">{lineData.text}</span>
    </motion.h1>
  );
};

export default function MySpaceListPage() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1 });

  // ---- Mobile pill state (touch devices only, using existing isTouchState) ----
  const [showPill, setShowPill] = useState(false);

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const [activeData, setActiveData] = useState({ lineIndex: null, percent: 0 });
  
  // 🌟 核心：硬件类型判定器 (同步Ref用于事件处理，异步State用于CSS重绘)
  const isTouchRef = useRef(false);
  const [isTouchState, setIsTouchState] = useState(false);

  useEffect(() => {
    const handlePointer = (e) => {
      const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';
      isTouchRef.current = isTouch;
      if (isTouch !== isTouchState) {
        setIsTouchState(isTouch);
      }
    };
    // 采用底层捕获，第一时间判断硬件设备身份
    window.addEventListener('pointerdown', handlePointer, true);
    window.addEventListener('pointermove', handlePointer, true);
    return () => {
      window.removeEventListener('pointerdown', handlePointer, true);
      window.removeEventListener('pointermove', handlePointer, true);
    };
  }, [isTouchState]);

  // 🌟 核心：坐标映射算法 — 统一使用视口坐标（fixed 定位）
  const updatePos = (clientX, clientY) => {
    // 无论鼠标还是触控，都使用视口坐标，配合 fixed 定位
    // 触控设备下图片固定在点击时的屏幕位置，不会随页面滚动而移动
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const lines = [
    { text: "MY CAT", images: [Cat1Img, Cat2Img, Cat3Img, Cat4Img, Cat5Img] },
    { text: "MY FRIENDS", images: [Friends1Img, Friends2Img, Friends3Img, Friends4Img] },
    { text: "FREQUENCY", images: [Music1Img, Music2Img, Music3Img, Music4Img, Music5Img] },
    { text: "FRAMES I LOVE", images: [Movie1Img, Movie2Img, Movie3Img, Movie4Img] },
    { text: "GAMES I PLAY", images: [GamesImg] },
    { text: "BOOKS I KEEP", images: [Books1Img, Books2Img] }
  ];

  const allImages = useMemo(() => {
    const imgs = [];
    lines.forEach(line => {
      if (line.images) {
        line.images.forEach(img => {
          if (!imgs.includes(img)) imgs.push(img);
        });
      }
    });
    return imgs;
  }, []);

  const catProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const eyesProgress = useTransform(scrollYProgress, [0.25, 0.95], [0, 1]);

  // 🌟 触控设备：点击空白区域关闭图片
  const handleContainerClick = useCallback((e) => {
    if (!isTouchRef.current) return;
    // 检查点击目标是否在文字行上（如果在文字行上，子元素的 stopPropagation 会阻止到这里）
    setActiveData({ lineIndex: null, percent: 0 });
  }, []);

  // 🌟 滑出页面后自动关闭图片
  useEffect(() => {
    if (!isInView && activeData.lineIndex !== null) {
      setActiveData({ lineIndex: null, percent: 0 });
    }
  }, [isInView, activeData.lineIndex]);

  const activeLine = activeData.lineIndex !== null ? lines[activeData.lineIndex] : null;
  let currentImageSrc = null;
  if (activeLine && activeLine.images?.length > 0) {
    const imgCount = activeLine.images.length;
    const imgIndex = Math.min(Math.floor(activeData.percent * imgCount), imgCount - 1);
    currentImageSrc = activeLine.images[imgIndex];
  }

  return (
    <section 
      id="myspace-list" 
      className="my-space-list-page-container" 
      ref={containerRef} 
      style={{ position: 'relative' }}
      onClick={handleContainerClick}
    >
      
      <div className="myspace-text-container">
        {lines.map((lineData, index) => (
          <AnimatedLine 
            key={index} lineData={lineData} index={index} 
            totalLines={lines.length} scrollYProgress={scrollYProgress} 
            isActive={activeData.lineIndex === index}
            isTouchRef={isTouchRef}
            updatePos={updatePos}
            onHover={(i, pct) => setActiveData({ lineIndex: i, percent: pct })}
            onClick={(i, pct) => {
              // 点击切换逻辑：第二次点击相同的选项将隐藏图片
              if (activeData.lineIndex === i) {
                setActiveData({ lineIndex: null, percent: 0 });
              } else {
                setActiveData({ lineIndex: i, percent: pct });
              }
            }}
          />
        ))}
      </div>

      <div className="myspace-stickers-container">
        <AnimatedSticker src={CatStickerImg} className="sticker-cat-face" progress={catProgress} />
        <AnimatedSticker src={EyesStickerImg} className="sticker-eyes-below" progress={eyesProgress} />
      </div>

      <div className="myspace-hover-hint">
        {t('myspaceList.hoverHint')}
      </div>

      <AnimatePresence>
        {currentImageSrc && (
          <motion.div
            className="myspace-hover-image-wrapper"
            style={{ 
              x: mouseX, 
              y: mouseY,
              // 🌟 统一使用 fixed 定位：鼠标模式图片跟随光标，触控模式图片固定在点击位置不随页面滚动
              position: 'fixed',
              top: 0, left: 0,
              pointerEvents: 'none',
              zIndex: 100
            }}
            initial={{ opacity: 0, filter: 'blur(15px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {allImages.map(src => (
              <img
                key={src} 
                src={src}
                className="myspace-hover-image"
                loading="lazy"
                decoding="async"
                style={{ 
                  opacity: currentImageSrc === src ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                }}
                alt="MySpace Preview"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile floating pill (touch devices only) */}
      <AnimatePresence>
        {isTouchState && showPill && (
          <div className="mobile-myspace-pill">
            <motion.div
              className="mobile-myspace-pill-inner"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, mass: 0.8 }}
            >
              {t('myspaceList.pillText')}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}