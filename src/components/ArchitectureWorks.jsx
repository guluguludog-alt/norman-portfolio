import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useSpring, animate, useMotionValueEvent } from 'framer-motion';
import './architectureWorks.css';

// 🌟 你的引用绝对保留，原封不动！
import Project1 from "../assets/Project1.jpg"; 
import Project2 from "../assets/Project2.jpg";   
import Project3 from "../assets/Project3.jpg";   
import Project4 from "../assets/Project4.jpg";
import Project5 from "../assets/Project5.jpg";

// =========================================================================
// 🌟 DecodeText 组件 (0.3s内完成，无 hover，统一 SansSerifFLF 字体)
// =========================================================================
const DecodeText = ({ text, className = "", style = {} }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [renderedElements, setRenderedElements] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    const lag = 3; 

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const newElements = [];
      for (let i = 0; i < text.length; i++) {
        if (iteration < i) {
          newElements.push(<span key={i} style={{ visibility: "hidden" }}>{text[i]}</span>);
        } else if (iteration >= i + lag) {
          newElements.push(<span key={i}>{text[i]}</span>);
        } else {
          if (text[i] === ' ') {
            newElements.push(<span key={i}> </span>);
          } else {
            newElements.push(<span key={i}>{letters[Math.floor(Math.random() * letters.length)]}</span>);
          }
        }
      }
      setRenderedElements(newElements);
      if (iteration >= text.length + lag) clearInterval(intervalRef.current);
      iteration += 1.5; 
    }, 15); 

    return () => clearInterval(intervalRef.current);
  }, [text]); 

  return (
    <div
      className={`decode-text-container ${className}`}
      style={{
        fontFamily: "'SansSerifFLF', sans-serif", 
        whiteSpace: "pre",
        cursor: "default",
        display: "inline-block",
        ...style
      }}
    >
      {renderedElements.length > 0 ? renderedElements : <span style={{visibility: 'hidden'}}>{text}</span>}
    </div>
  );
};


// =========================================================================
// 照片单体组件 (文字锚定在图片上，永不越界)
// =========================================================================
const PhotoItem = ({ index, config, smoothY, isExpanded, showText }) => { 
  const lerp = (start, end, t) => start + (end - start) * t;
  const easeInOut = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const timelineConfig = {
    4: { start: 0.000, duration: 0.450 },
    0: { start: 0.060, duration: 0.420 },
    3: { start: 0.140, duration: 0.400 },
    2: { start: 0.200, duration: 0.380 },
    1: { start: 0.260, duration: 0.360 } 
  };

  const sprayStart = timelineConfig[index].start; 
  const sprayDuration = timelineConfig[index].duration; 
  const sprayEnd = sprayStart + sprayDuration; 
  
  const stackStart = sprayEnd + 0.02; 
  const stackEnd = stackStart + 0.15; 

  const startX = 0; 
  const startY = 45; 

  const visualSlotIndex = {
    1: 0, 0: 1, 4: 2, 3: 3, 2: 4 
  }[index];

  const getSlotState = (slot) => {
    const slots = [
      { x: -150, scale: 2.2, blur: 0, bright: 1, saturate: 1, opacity: 0 }, 
      { x: 0,  scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }, 
      { x: 6,  scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }, 
      { x: 12, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }, 
      { x: 18, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }, 
      { x: 24, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }  
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
    const targetX = getSlotState(visualSlotIndex).x; 
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
    const targetScale = getSlotState(visualSlotIndex).scale; 
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
    const targetScale = getSlotState(visualSlotIndex).scale; 
    if (yP <= sprayStart) return 0.05; 
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / (sprayEnd - sprayStart);
      const baseScale = lerp(0.05, config.scatterS, easeInOut(t)); 
      const maxAddMap = { 4: 10, 0: 8, 3: 7 };
      const maxAdd = maxAddMap[index] !== undefined ? maxAddMap[index] : 5; 
      let stretchRatio = 1;
      if (t <= 0.2) {
        const p = t / 0.2;
        stretchRatio = 1 + maxAdd * (1 - Math.pow(1 - p, 2)); 
      } else {
        const p = (t - 0.2) / 0.8;
        stretchRatio = 1 + maxAdd * Math.pow(1 - p, 2); 
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
    const targetBlur = getSlotState(visualSlotIndex).blur;
    if (yP < stackStart) return 0;
    if (yP < stackEnd) return lerp(0, targetBlur, (yP - stackStart) / (stackEnd - stackStart));
    return targetBlur;
  });

  const brightnessValue = useTransform(() => {
    const yP = smoothY.get();
    const targetBright = getSlotState(visualSlotIndex).bright;
    if (yP < stackStart) return 1; 
    if (yP < stackEnd) return lerp(1, targetBright, (yP - stackStart) / (stackEnd - stackStart));
    return targetBright;
  });

  const saturateValue = useTransform(() => {
    const yP = smoothY.get();
    const targetSaturate = getSlotState(visualSlotIndex).saturate;
    if (yP < stackStart) return 1; 
    if (yP < stackEnd) return lerp(1, targetSaturate, (yP - stackStart) / (stackEnd - stackStart)); 
    return targetSaturate;
  });

  const opacity = useTransform(() => {
    return getSlotState(visualSlotIndex).opacity;
  });

  const zIndex = useTransform(() => {
    return Math.round(30 - visualSlotIndex); 
  });

  const filter = useMotionTemplate`blur(${blurValue}px) brightness(${brightnessValue}) saturate(${saturateValue})`;

  // 🌟 重新设计的散开位移：完美满足距离不变、不出界要求
  // 最左侧图片往左平移 15vw（确保绝对不出界）。其余右侧的所有图片统一往右平移 15vw，间距永远不变！
  const expandedOffsetX = {
    1: -15, // P2 (最左侧大图) 往左
    0: 15,  // 以下全部往右，且距离等分保留
    4: 15, 
    3: 15,
    2: 15
  }[index];

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={`genie-clip-${index}`} clipPathUnits="objectBoundingBox">
            <motion.path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>
      
      {/* 🌟 外层 Wrapper 负责整体弹开，携带内层组件一起移动 */}
      <motion.div
        style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex }}
        initial={false}
        animate={{ x: isExpanded ? `${expandedOffsetX}vw` : "0vw" }}
        transition={{ type: "spring", bounce: 0.2, duration: 1 }} 
      >
        {/* 🌟 核心绑定技术：此内层 wrapper 会继承图像原始计算出的 x, y 坐标系统！*/}
        <motion.div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, x, y }}>
          
          {/* 图片依然接受各种 Scale/Rotate 等复杂变形 */}
          <motion.img
            src={config.image}
            alt={`Architecture Work ${index + 1}`}
            className="flying-photo"
            style={{ 
              rotateZ, scaleX, scaleY, filter, opacity, clipPath: clipPathStyle, transformOrigin,
              boxShadow: 'none', WebkitBoxShadow: 'none', pointerEvents: 'auto'
            }}
          />

          {/* 🌟 标题文本：绝对锚定在左侧第一张图 (index 1) 的左下角 */}
          {showText && index === 1 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                left: '50%', top: '50%', // 图片中心原点
                marginLeft: '-14vw', // 向左平移到图片左边缘
                marginTop: '19vh',   // 向下平移到图片下方
                pointerEvents: 'auto'
              }}
            >
              <h2 style={{ fontSize: '1.4vw', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                <DecodeText text="Mahuangliang Art House Hotel Design" />
              </h2>
              <h3 style={{ fontSize: '1.0vw', color: '#0000FF', margin: 0, fontWeight: 'bold' }}>
                <DecodeText text="Shanxi Yulin" />
              </h3>
            </motion.div>
          )}

          {/* 🌟 数据文本：绝对锚定在最右侧那张图 (index 2) 的右边 */}
          {showText && index === 2 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                left: '50%', top: '50%', // 图片中心原点
                marginLeft: '12vw', // 贴在堆叠最右侧图的右边
                marginTop: '-15vh',
                pointerEvents: 'auto',
                display: 'flex', flexDirection: 'column', gap: '2vh'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.8vw', margin: '0 0 3px 0', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="Gross Floor Area:" />
                </h4>
                <p style={{ fontSize: '0.8vw', color: '#0000FF', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="Approximately 10,000 hectares" />
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8vw', margin: '0 0 3px 0', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="Number of Guest Rooms" />
                </h4>
                <p style={{ fontSize: '0.8vw', color: '#0000FF', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="61 Rooms" />
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.8vw', margin: '0 0 3px 0', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="Completion Date:" />
                </h4>
                <p style={{ fontSize: '0.8vw', color: '#0000FF', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                  <DecodeText text="October 2024" />
                </p>
              </div>
              
              {/* 🌟 极致紧凑、现代的小巧按钮 */}
              <button style={{
                 marginTop: '2vh', padding: '6px 18px', backgroundColor: '#0000FF', color: 'white', 
                 border: 'none', borderRadius: '4px', fontSize: '0.8vw', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start',
                 fontFamily: "'SansSerifFLF', sans-serif"
              }}>
                Details
              </button>
            </motion.div>
          )}

        </motion.div>
      </motion.div>
    </>
  );
};


export default function ArchitectureWorks() {
  const containerRef = useRef(null);
  const isSnapping = useRef(false);
  const snapAnimRef = useRef(null); 

  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothY = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  // 🌟 1. 立刻解除滚动限制：弹开动画开始的瞬间就停止系统吸附！
  useMotionValueEvent(smoothY, "change", (latest) => {
    if (latest >= 0.89) {
      setIsExpanded(true);
      if (snapAnimRef.current) {
        snapAnimRef.current.stop(); 
      }
    } else {
      setIsExpanded(false);
    }
  });

  useEffect(() => {
    const handleWheel = () => {
      if (snapAnimRef.current) {
        snapAnimRef.current.stop();
        isSnapping.current = false;
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    let timer;
    if (isExpanded) {
      timer = setTimeout(() => setShowText(true), 800);
    } else {
      setShowText(false);
    }
    return () => clearTimeout(timer);
  }, [isExpanded]);

  useEffect(() => {
    let timeout;
    const handleSnap = () => {
      if (isSnapping.current) return;
      const progress = scrollYProgress.get(); 

      if (progress > 0.55 && progress < 0.90 && !isExpanded) {
        isSnapping.current = true;
        const container = containerRef.current;
        const currentScroll = window.scrollY;
        const maxScroll = container.offsetHeight - window.innerHeight;
        const targetScroll = container.offsetTop + maxScroll * 0.90;

        snapAnimRef.current = animate(currentScroll, targetScroll, {
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
  }, [scrollYProgress, isExpanded]);

  const folderRotateX = useTransform(smoothY, [0, 0.25], [0, -28]);
  const folderY = useTransform(smoothY, [0.6, 0.81], ["0vh", "35vh"]);
  const folderOpacity = useTransform(smoothY, [0.6, 0.81], [1, 0]);
  const auroraBrightness = useTransform(smoothY, [0, 0.16, 0.65], [1, 1.7, 0.6]);

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
              key={index} 
              index={index} 
              config={config} 
              smoothY={smoothY}
              isExpanded={isExpanded} 
              showText={showText} // 🌟 控制文字渲染时机传递进去
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

      </div>
    </section>
  );
}