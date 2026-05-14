import React, { useRef } from 'react';
import { useMotionValueEvent } from 'framer-motion';
import './mySpaceListPage.css';

export default function AnimatedSticker({ src, className, progress }) {
  const sceneRef = useRef(null);
  const pastedRef = useRef(null);
  const unpastedRef = useRef(null);
  const overlayRef = useRef(null);

  // 缓动函数，让粘贴动作更具物理质感
  const easeInOutCubic = (x) => {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };

  useMotionValueEvent(progress, "change", (latest) => {
    if (!sceneRef.current || !pastedRef.current || !unpastedRef.current || !overlayRef.current) return;

    // 🌟 核心逻辑：动画未开始前彻底隐藏，动画开始瞬间显现
    // 粘贴动画就是它们的“出场动画”
    if (latest <= 0) {
      sceneRef.current.style.opacity = 0;
      sceneRef.current.style.pointerEvents = 'none';
      return;
    } else {
      sceneRef.current.style.opacity = 1;
      sceneRef.current.style.pointerEvents = 'auto';
    }

    const rect = sceneRef.current.getBoundingClientRect();
    const W = rect.width || 1;
    const H = rect.height || 1;

    const p = easeInOutCubic(latest);
    const percent = p * 100;

    const angleRad = Math.atan2(H, -W); 
    const exactCssAngle = (angleRad * (180 / Math.PI)) + 90;

    // 分割图层遮罩
    const maskPasted = `linear-gradient(${exactCssAngle}deg, black calc(${percent}% + 4px), transparent calc(${percent}% + 4px))`;
    const maskUnpasted = `linear-gradient(${exactCssAngle}deg, transparent calc(${percent}% - 4px), black calc(${percent}% - 4px))`;

    pastedRef.current.style.webkitMaskImage = maskPasted;
    pastedRef.current.style.maskImage = maskPasted;
    
    unpastedRef.current.style.webkitMaskImage = maskUnpasted;
    unpastedRef.current.style.maskImage = maskUnpasted;

    unpastedRef.current.style.transformOrigin = `${100 - percent}% ${percent}%`;
    const stretchDistortion = 1 + (0.04 * Math.sin(p * Math.PI));
    const angle = 85 * (1 - p); 
    
    unpastedRef.current.style.transform = `rotate3d(${H}, ${W}, 0, ${angle}deg) scale(${stretchDistortion})`;

    // 渲染折痕光影
    if (p > 0.01 && p < 0.99) {
      overlayRef.current.style.background = `linear-gradient(${exactCssAngle}deg, 
          transparent calc(${percent}% - 5px), 
          rgba(255, 255, 255, 1) calc(${percent}% + 2px),  
          rgba(255, 255, 255, 0.4) calc(${percent}% + 8px), 
          rgba(0, 0, 0, 0.65) calc(${percent}% + 18px),    
          rgba(0, 0, 0, 0.1) calc(${percent}% + 35px),
          transparent calc(${percent}% + 50px)             
      )`;
      overlayRef.current.style.opacity = 1;
    } else {
      overlayRef.current.style.opacity = 0;
    }
  });

  return (
    <div className={`animated-sticker-scene ${className}`} ref={sceneRef}>
      <img src={src} alt="placeholder" style={{ width: '100%', height: 'auto', opacity: 0, display: 'block' }} />
      
      <div 
        className="sticker-layer sticker-pasted" 
        ref={pastedRef} 
        style={{ backgroundImage: `url(${src})` }}
      ></div>

      <div 
        className="sticker-layer sticker-unpasted" 
        ref={unpastedRef} 
        style={{ backgroundImage: `url(${src})` }}
      >
        <div 
          className="distortion-overlay" 
          ref={overlayRef}
          style={{ 
            WebkitMaskImage: `url(${src})`, 
            WebkitMaskSize: '100% 100%',
            maskImage: `url(${src})`,
            maskSize: '100% 100%'
          }}
        ></div>
      </div>
    </div>
  );
}