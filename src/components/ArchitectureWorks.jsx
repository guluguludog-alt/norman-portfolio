import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring, animate } from 'framer-motion';
import './architectureWorks.css';

// 🌟 你的引用绝对保留，原封不动！
import Project1 from "../assets/Project1.jpg"; 
import Project2 from "../assets/Project2.jpg";   
import Project3 from "../assets/Project3.jpg";   
import Project4 from "../assets/Project4.jpg";
import Project5 from "../assets/Project5.jpg";

const PhotoItem = ({ index, config, smoothY, scrollXProgress }) => {
  const lerp = (start, end, t) => start + (end - start) * t;
  
  // 慢-快-慢 的非线性移动曲线 (Cubic Ease-In-Out)
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const sprayStart = index * 0.02; 
  const sprayDuration = 0.35 + (index % 3) * 0.02; 
  const sprayEnd = sprayStart + sprayDuration; 
  
  const stackStart = 0.42 + index * 0.02; 
  const stackEnd = stackStart + 0.25; 

  const startX = 0; 
  const startY = 45; 

  const getSlotState = (slot) => {
    const slots = [
      { x: -150, scale: 2.2, blur: 0, bright: 1, saturate: 1, opacity: 0 }, 
      { x: -18, scale: 1.8, blur: 0, bright: 1, saturate: 1, opacity: 1 },  
      { x: 5, scale: 1.45, blur: 3, bright: 0.55, saturate: 0.9, opacity: 1 }, 
      { x: 25, scale: 1.15, blur: 8, bright: 0.3, saturate: 0.7, opacity: 1 },  
      { x: 42, scale: 0.9, blur: 9, bright: 0.15, saturate: 0.5, opacity: 1 }, 
      { x: 58, scale: 0.7, blur: 12, bright: 0.05, saturate: 0.2, opacity: 1 }   
    ];
    if (slot <= -0.6) return slots[0]; 
    if (slot >= 4) return slots[5];
    let lowerIndex = Math.max(0, Math.min(5, Math.floor(slot) + 1));
    let upperIndex = Math.max(0, Math.min(5, Math.ceil(slot) + 1));
    const t = slot - Math.floor(slot);
    if (lowerIndex === upperIndex) return slots[lowerIndex];
    return {
      x: lerp(slots[lowerIndex].x, slots[upperIndex].x, t),
      scale: lerp(slots[lowerIndex].scale, slots[upperIndex].scale, t),
      blur: lerp(slots[lowerIndex].blur, slots[upperIndex].blur, t),
      bright: lerp(slots[lowerIndex].bright, slots[upperIndex].bright, t),
      saturate: lerp(slots[lowerIndex].saturate, slots[upperIndex].saturate, t),
      opacity: lerp(slots[lowerIndex].opacity, slots[upperIndex].opacity, t)
    };
  };

  const x = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetX = getSlotState(index - (xP * 4)).x;
    
    if (yP <= sprayStart) return startX + "vw";
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      const ease = easeInOut(t); 
      const bow = Math.sin(t * Math.PI) * (config.scatterX * 0.35);
      return lerp(startX, config.scatterX, ease) + bow + "vw"; 
    }
    if (yP < stackStart) return config.scatterX + "vw";
    if (yP < stackEnd) return lerp(config.scatterX, targetX, (yP - stackStart) / (stackEnd - stackStart)) + "vw";
    return targetX + "vw";
  });

  const y = useTransform(() => {
    const yP = smoothY.get();
    if (yP <= sprayStart) return startY + "vh";
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      const ease = easeInOut(t); 
      return lerp(startY, config.scatterY, ease) + "vh"; 
    }
    if (yP < stackStart) return config.scatterY + "vh";
    if (yP < stackEnd) return lerp(config.scatterY, 0, (yP - stackStart) / (stackEnd - stackStart)) + "vh";
    return "0vh"; 
  });

  const rotateZ = useTransform(() => {
    const yP = smoothY.get();
    if (yP <= sprayStart) return 0;
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      return lerp(0, config.scatterR, easeInOut(t)); 
    }
    if (yP < stackStart) return config.scatterR;
    if (yP < stackEnd) return lerp(config.scatterR, 0, (yP - stackStart) / (stackEnd - stackStart));
    return 0;
  });

  const scaleX = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetScale = getSlotState(index - (xP * 4)).scale;
    if (yP <= sprayStart) return 0.05; 
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      return lerp(0.05, config.scatterS, easeInOut(t)); 
    }
    if (yP < stackStart) return config.scatterS;
    if (yP < stackEnd) return lerp(config.scatterS, targetScale, (yP - stackStart) / (stackEnd - stackStart));
    return targetScale;
  });

  const scaleY = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetScale = getSlotState(index - (xP * 4)).scale;
    
    if (yP <= sprayStart) return 0.05; 
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      const baseScale = lerp(0.05, config.scatterS, easeInOut(t)); 
      
      let stretchRatio = 1;
      if (t <= 0.2) {
        const p = t / 0.2;
        stretchRatio = 1 + 4 * (1 - Math.pow(1 - p, 2));
      } else {
        const p = (t - 0.2) / 0.8;
        stretchRatio = 1 + 4 * Math.pow(1 - p, 2);
      }
      
      return baseScale * stretchRatio; 
    }
    if (yP < stackStart) return config.scatterS;
    if (yP < stackEnd) return lerp(config.scatterS, targetScale, (yP - stackStart) / (stackEnd - stackStart));
    return targetScale;
  });

  const clipPathD = useTransform(() => {
    const yP = smoothY.get();
    const defaultRect = `M 0 0 C 0 0.3, 0 0.7, 0 1 L 1 1 C 1 0.7, 1 0.3, 1 0 Z`;
    
    if (yP <= sprayStart || yP >= sprayEnd) return defaultRect;
    
    const t = (yP - sprayStart) / (sprayEnd - sprayStart);
    const ease = easeInOut(t); 
    
    const maxPinch = 7 / 15; 
    const pinch = maxPinch * (1 - ease);
    const shift = -config.scatterX * 0.015 * (1 - ease);

    const botL = pinch + shift;
    const botR = 1 - pinch + shift;

    return `M 0 0 C 0 0.3, ${botL} 0.7, ${botL} 1 L ${botR} 1 C ${botR} 0.7, 1 0.3, 1 0 Z`;
  });

  const clipPathStyle = useTransform(() => {
    const yP = smoothY.get();
    if (yP <= sprayStart || yP >= sprayEnd) return "none";
    return `url(#genie-clip-${index})`;
  });

  const transformOrigin = "50% 50%";

  const blurValue = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetBlur = getSlotState(index - (xP * 4)).blur;
    
    if (yP < stackStart) return 0;
    if (yP < stackEnd) return lerp(0, targetBlur, (yP - stackStart) / (stackEnd - stackStart));
    return targetBlur;
  });

  const brightnessValue = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetBright = getSlotState(index - (xP * 4)).bright;
    if (yP < stackStart) return 1; 
    if (yP < stackEnd) return lerp(1, targetBright, (yP - stackStart) / (stackEnd - stackStart));
    return targetBright;
  });

  const saturateValue = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    const targetSaturate = getSlotState(index - (xP * 4)).saturate;
    if (yP < stackStart) return 1; 
    if (yP < stackEnd) return lerp(1, targetSaturate, (yP - stackStart) / (stackEnd - stackStart)); 
    return targetSaturate;
  });

  const opacity = useTransform(() => {
    const yP = smoothY.get();
    const xP = scrollXProgress.get();
    return getSlotState(index - (xP * 4)).opacity;
  });

  const zIndex = useTransform(() => {
    const xP = scrollXProgress.get();
    return Math.round(30 - Math.abs(index - (xP * 4)));
  });

  const filter = useMotionTemplate`blur(${blurValue}px) brightness(${brightnessValue}) saturate(${saturateValue})`;

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={`genie-clip-${index}`} clipPathUnits="objectBoundingBox">
            <motion.path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>
      
      <motion.img
        src={config.image}
        alt={`Architecture Work ${index + 1}`}
        className="flying-photo"
        style={{ 
          x, y, 
          rotateZ, 
          scaleX, scaleY, 
          filter, zIndex, opacity,
          clipPath: clipPathStyle,
          transformOrigin 
        }}
      />
    </>
  );
};

export default function ArchitectureWorks() {
  const containerRef = useRef(null);
  const scrollXRef = useRef(null); 
  const isSnapping = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollXProgress } = useScroll({ container: scrollXRef });

  const smoothY = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  useEffect(() => {
    let timeout;
    const handleSnap = () => {
      if (isSnapping.current) return;
      const progress = scrollYProgress.get(); 

      if (progress > 0.55 && progress < 0.80) {
        isSnapping.current = true;
        const container = containerRef.current;
        const currentScroll = window.scrollY;
        
        const maxScroll = container.offsetHeight - window.innerHeight;
        const targetScroll = container.offsetTop + maxScroll * 0.81;

        animate(currentScroll, targetScroll, {
          type: "spring", stiffness: 50, damping: 20,
          onUpdate: (latest) => window.scrollTo(0, latest),
          onComplete: () => { isSnapping.current = false; }
        });
      }
    };
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleSnap, 200); 
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollYProgress]);

  const folderRotateX = useTransform(smoothY, [0, 0.25], [0, -28]);
  const folderY = useTransform(smoothY, [0.6, 0.81], ["0vh", "35vh"]);
  const folderOpacity = useTransform(smoothY, [0.6, 0.81], [1, 0]);

  const auroraBrightness = useTransform(smoothY, [0, 0.16, 0.45], [1, 1.7, 0.6]);

  const overlayPointerEvents = useTransform(scrollYProgress, (v) => v > 0.80 ? "auto" : "none");

  const scatterConfigs = [
    { image: Project1, scatterX: -25, scatterY: -15, scatterR: -6, scatterS: 1.3 },
    { image: Project2, scatterX: -42, scatterY: 15, scatterR: -15, scatterS: 1.1 },
    { image: Project3, scatterX: 38, scatterY: 12, scatterR: 10, scatterS: 1.15 },
    { image: Project4, scatterX: 32, scatterY: -18, scatterR: 18, scatterS: 0.85 },
    { image: Project5, scatterX: 5, scatterY: -25, scatterR: 4, scatterS: 1.0 }
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

        {/* 🌟 极光特效：核心替换为电光紫 #5211dd (RGB: 82, 17, 221) */}
        <motion.div
          className="folder-aurora-glow"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-5vh',
            width: '70vw',
            height: '45vh',
            x: '-50%',
            y: folderY, 
            background: 'radial-gradient(ellipse at 50% 80%, rgba(82, 17, 221, 0.95) 0%, rgba(82, 17, 221, 0.5) 45%, rgba(0, 0, 0, 0) 70%)',
            filter: useMotionTemplate`blur(45px) brightness(${auroraBrightness})`,
            opacity: folderOpacity,
            zIndex: 15, 
            pointerEvents: 'none',
            mixBlendMode: 'screen'
          }}
        />

        <div className="photos-center-container" style={{ zIndex: 20 }}>
          {scatterConfigs.map((config, index) => (
            <PhotoItem 
              key={index} index={index} config={config} 
              smoothY={smoothY} scrollXProgress={scrollXProgress}
            />
          ))}
        </div>

        <motion.div 
          className="folder-front-glass"
          style={{ y: folderY, opacity: folderOpacity, rotateX: folderRotateX, transformOrigin: "bottom center", zIndex: 50 }}
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
          onWheel={(e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) window.scrollBy(0, e.deltaY);
          }}
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