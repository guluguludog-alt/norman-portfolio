import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedSticker from './AnimatedSticker'; 
import './mySpaceListPage.css';

// 导入贴纸
import CatStickerImg from '../assets/CatSticker1.png';
import EyesStickerImg from '../assets/EyesSticker.png';

// 导入所有悬浮预览序列图
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

const AnimatedLine = ({ lineData, index, totalLines, scrollYProgress, isActive, onToggle }) => {
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

  // 🌟 核心：改为点击判定
  const handleClick = (e) => {
    // 如果当前项已经处于激活状态，再次点击将其关闭
    if (isActive) {
      onToggle(null, 0);
    } else {
      // 如果未激活，计算点击位置，并展开图片
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let clickPercent = x / rect.width;
      clickPercent = Math.max(0, Math.min(1, clickPercent));
      onToggle(index, clickPercent);
    }
  };

  return (
    <motion.h1 
      className="myspace-text-line" 
      style={{ backgroundImage: animatedGradient }}
      onClick={handleClick} /* 🌟 将交互改为 Click */
    >
      <span className="myspace-main-text">{lineData.text}</span>
    </motion.h1>
  );
};

export default function MySpaceListPage() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 🌟 状态存储目前激活的数据，lineIndex 为 null 即代表全部关闭
  const [activeData, setActiveData] = useState({ lineIndex: null, percent: 0 });

  // 保留全局鼠标移动侦测，为了让展示出来的预览图可以丝滑地跟着鼠标走
  useEffect(() => {
    const updateMousePos = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('pointermove', updateMousePos);
    return () => window.removeEventListener('pointermove', updateMousePos);
  }, [mouseX, mouseY]);

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

  const catProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const eyesProgress = useTransform(scrollYProgress, [0.25, 0.95], [0, 1]);

  // 根据当前激活的索引渲染图片
  const activeLine = activeData.lineIndex !== null ? lines[activeData.lineIndex] : null;
  let currentImageSrc = null;
  if (activeLine && activeLine.images?.length > 0) {
    const imgCount = activeLine.images.length;
    const imgIndex = Math.min(Math.floor(activeData.percent * imgCount), imgCount - 1);
    currentImageSrc = activeLine.images[imgIndex];
  }

  return (
    <section id="myspace-list" className="my-space-list-page-container" ref={containerRef}>
      
      <div className="myspace-text-container">
        {lines.map((lineData, index) => (
          <AnimatedLine 
            key={index} 
            lineData={lineData} 
            index={index} 
            totalLines={lines.length} 
            scrollYProgress={scrollYProgress} 
            isActive={activeData.lineIndex === index}
            onToggle={(i, pct) => setActiveData({ lineIndex: i, percent: pct })}
          />
        ))}
      </div>

      <div className="myspace-stickers-container">
        <AnimatedSticker 
          src={CatStickerImg} 
          className="sticker-cat-face" 
          progress={catProgress} 
        />
        <AnimatedSticker 
          src={EyesStickerImg} 
          className="sticker-eyes-below" 
          progress={eyesProgress} 
        />
      </div>

      <div className="myspace-hover-hint">
        {/* 如果需要，您可以去 json 文件把提示字由 hover 稍微改为 click */}
        {t('myspaceList.hoverHint')}
      </div>

      <AnimatePresence>
        {currentImageSrc && (
          <motion.div
            className="myspace-hover-image-wrapper"
            style={{ x: mouseX, y: mouseY }}
            initial={{ opacity: 0, filter: 'blur(15px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(15px)' }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <AnimatePresence>
              <motion.img
                key={currentImageSrc} 
                src={currentImageSrc}
                className="myspace-hover-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}