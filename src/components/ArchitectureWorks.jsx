import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import './architectureWorks.css';

const PhotoItem = ({ index, config, scrollYProgress, scrollXProgress }) => {
  const lerp = (start, end, t) => start + (end - start) * t;

  // 🌟 核心修复 1：消灭“滚动死区”，让时间轴无缝衔接
  const sprayStart = 0; 
  const sprayEnd = 0.15; // 喷射在此结束
  
  // 仅仅停顿极短的 0.03 后，立刻开始堆叠排列！带有轻微的依次错落感
  const stackStart = 0.18 + index * 0.02; 
  const stackEnd = stackStart + 0.25;

  const originX = 0;
  const originY = 50; 

  const getSlotState = (slot) => {
    const slots = [
      { x: -75, scale: 2.2, blur: 0, bright: 1 },    
      { x: -18, scale: 1.8, blur: 0, bright: 1 },    
      { x: 5, scale: 1.45, blur: 3, bright: 0.85 },  
      { x: 25, scale: 1.15, blur: 6, bright: 0.7 },  
      { x: 42, scale: 0.9, blur: 9, bright: 0.55 },  
      { x: 58, scale: 0.7, blur: 12, bright: 0.4 }   
    ];

    if (slot <= -1) return slots[0];
    if (slot >= 4) return slots[5];

    let lowerIndex = Math.max(0, Math.min(5, Math.floor(slot) + 1));
    let upperIndex = Math.max(0, Math.min(5, Math.ceil(slot) + 1));
    const t = slot - Math.floor(slot);

    if (lowerIndex === upperIndex) return slots[lowerIndex];
    return {
      x: lerp(slots[lowerIndex].x, slots[upperIndex].x, t),
      scale: lerp(slots[lowerIndex].scale, slots[upperIndex].scale, t),
      blur: lerp(slots[lowerIndex].blur, slots[upperIndex].blur, t),
      bright: lerp(slots[lowerIndex].bright, slots[upperIndex].bright, t)
    };
  };

  const x = useTransform(() => {
    const yP = scrollYProgress.get();
    const xP = scrollXProgress.get();
    const slot = index - (xP * 4);
    const targetX = getSlotState(slot).x;

    if (yP < sprayStart) return originX + "vw";
    if (yP < sprayEnd) return lerp(originX, config.scatterX, (yP - sprayStart) / (sprayEnd - sprayStart)) + "vw";
    if (yP < stackStart) return config.scatterX + "vw";
    if (yP < stackEnd) return lerp(config.scatterX, targetX, (yP - stackStart) / (stackEnd - stackStart)) + "vw";
    return targetX + "vw";
  });

  const y = useTransform(() => {
    const yP = scrollYProgress.get();
    
    if (yP < sprayStart) return originY + "vh";
    if (yP < sprayEnd) return lerp(originY, config.scatterY, (yP - sprayStart) / (sprayEnd - sprayStart)) + "vh";
    if (yP < stackStart) return config.scatterY + "vh";
    if (yP < stackEnd) return lerp(config.scatterY, 0, (yP - stackStart) / (stackEnd - stackStart)) + "vh";
    return "0vh"; 
  });

  const rotate = useTransform(() => {
    const yP = scrollYProgress.get();
    if (yP < sprayStart) return 0;
    if (yP < sprayEnd) return lerp(0, config.scatterR, (yP - sprayStart) / (sprayEnd - sprayStart));
    if (yP < stackStart) return config.scatterR;
    if (yP < stackEnd) return lerp(config.scatterR, 0, (yP - stackStart) / (stackEnd - stackStart));
    return 0;
  });

  const scale = useTransform(() => {
    const yP = scrollYProgress.get();
    const xP = scrollXProgress.get();
    const slot = index - (xP * 4);
    const targetScale = getSlotState(slot).scale;

    if (yP < sprayStart) return 0.1;
    if (yP < sprayEnd) return lerp(0.1, config.scatterS, (yP - sprayStart) / (sprayEnd - sprayStart));
    if (yP < stackStart) return config.scatterS;
    if (yP < stackEnd) return lerp(config.scatterS, targetScale, (yP - stackStart) / (stackEnd - stackStart));
    return targetScale;
  });

  const blurValue = useTransform(() => {
    const yP = scrollYProgress.get();
    const xP = scrollXProgress.get();
    const slot = index - (xP * 4);
    const targetBlur = getSlotState(slot).blur;

    if (yP < stackStart) return 0;
    if (yP < stackEnd) return lerp(0, targetBlur, (yP - stackStart) / (stackEnd - stackStart));
    return targetBlur;
  });

  const brightnessValue = useTransform(() => {
    const yP = scrollYProgress.get();
    const xP = scrollXProgress.get();
    const slot = index - (xP * 4);
    const targetBright = getSlotState(slot).bright;

    if (yP < stackStart) return 1;
    if (yP < stackEnd) return lerp(1, targetBright, (yP - stackStart) / (stackEnd - stackStart));
    return targetBright;
  });

  const zIndex = useTransform(() => {
    const xP = scrollXProgress.get();
    const slot = index - (xP * 4);
    return Math.round(30 - Math.abs(slot));
  });

  const filter = useMotionTemplate`blur(${blurValue}px) brightness(${brightnessValue})`;

  return (
    <motion.img
      src={`https://picsum.photos/seed/${index + 3024}/800/500`}
      alt={`Architecture Work ${index + 1}`}
      className="flying-photo"
      style={{ x, y, rotate, scale, filter, zIndex }}
    />
  );
};

export default function ArchitectureWorks() {
  const containerRef = useRef(null);
  const scrollXRef = useRef(null); 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollXProgress } = useScroll({
    container: scrollXRef
  });

  const folderRotateX = useTransform(scrollYProgress, [0, 0.15], [0, -28]);
  
  // 🌟 核心修复 2：文件夹沉底动画提前，和照片列队同步进行
  const folderY = useTransform(scrollYProgress, [0.25, 0.50], ["0vh", "30vh"]);
  const folderOpacity = useTransform(scrollYProgress, [0.25, 0.50], [1, 0]);

  // 🌟 核心修复 3：横向画廊更早激活！不用再傻等往下滚了
  const overlayPointerEvents = useTransform(scrollYProgress, (v) => v > 0.55 ? "auto" : "none");

  const scatterConfigs = [
    { scatterX: -25, scatterY: -15, scatterR: -6, scatterS: 1.3 },
    { scatterX: -42, scatterY: 15, scatterR: -15, scatterS: 1.1 },
    { scatterX: 38, scatterY: 12, scatterR: 10, scatterS: 1.15 },
    { scatterX: 32, scatterY: -18, scatterR: 18, scatterS: 0.85 },
    { scatterX: 5, scatterY: -25, scatterR: 4, scatterS: 1.0 }
  ];

  return (
    <section id="architecture-works" className="architecture-works-section" ref={containerRef}>
      <div className="sticky-viewport">
        
        <motion.div 
          className="folder-piece"
          style={{ y: folderY, opacity: folderOpacity, zIndex: 10 }}
        >
          <div className="folder-tab"></div>
          <div className="folder-back-bg"></div>
        </motion.div>

        <div className="photos-center-container" style={{ zIndex: 20 }}>
          {scatterConfigs.map((config, index) => (
            <PhotoItem 
              key={index} 
              index={index} 
              config={config} 
              scrollYProgress={scrollYProgress}
              scrollXProgress={scrollXProgress}
            />
          ))}
        </div>

        <motion.div 
          className="folder-front-glass"
          style={{ 
            y: folderY, 
            opacity: folderOpacity, 
            rotateX: folderRotateX, 
            transformOrigin: "bottom center",
            zIndex: 50 
          }}
        >
          <div className="folder-ui-top">
            <h3>Architecture</h3>
            <p>Works & Projects</p>
          </div>
          <div className="folder-ui-bottom">
            <span className="folder-count">05</span>
            <div className="folder-circle-icon"></div>
          </div>
        </motion.div>

        <motion.div 
          className="horizontal-scroll-overlay" 
          ref={scrollXRef}
          style={{ pointerEvents: overlayPointerEvents }}
        >
          <div className="scroll-track">
            {scatterConfigs.map((_, i) => (
              <div key={i} className="scroll-snap-point" />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}