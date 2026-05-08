import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  animate,
  useMotionValueEvent,
  useMotionValue,
  AnimatePresence,
  useVelocity
} from 'framer-motion';
import { ReactLenis, useLenis } from 'lenis/react';
import { useNavigate } from 'react-router-dom';
import './architectureWorks.css';

import Project1 from "../assets/Project1.jpg";
import Project2 from "../assets/Project2.jpg";
import Project3 from "../assets/Project3.jpg";
import Project4 from "../assets/Project4.jpg";
import Project5 from "../assets/Project5.jpg";

/* ============================
   DecodeText 组件
   ============================ */
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
    <div className={`decode-text-container ${className}`} style={{
      fontFamily: "'SansSerifFLF', sans-serif",
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      cursor: "default", display: "inline-block", ...style
    }}>
      {renderedElements.length > 0 ? renderedElements : <span style={{ visibility: 'hidden' }}>{text}</span>}
    </div>
  );
};

/* ============================
   项目数据
   ============================ */
const projectDataConfig = {
  1: {
    title: "Beichuan Erma Exhibition Hall",
    subtitle: "Mianyang, Sichuan Province，China",
    details: [
      { label: "Building Program:", value: "Embroidery Exhibition Hall and Rural Theater" },
      { label: "Completion Date:", value: "September 2021" }
    ]
  },
  0: {
    title: "Mahuangliang Art House Hotel Design",
    subtitle: "Yulin, Shaanxi Province，China",
    details: [
      { label: "Gross Floor Area:", value: "Approximately 10,000 m²" },
      { label: "Number of Guest Rooms:", value: "Approximately 40 Rooms" },
      { label: "Completion Date:", value: "October 2024" }
    ]
  },
  4: {
    title: "Adaptive Reuse Design of the Former Glass Factory",
    subtitle: "Urumqi, Xinjiang，China",
    details: [
      { label: "Building Program:", value: "Commercial, Marketplace, and Cultural & Creative Park" },
      { label: "Completion Date:", value: "March 2025" }
    ]
  },
  3: {
    title: "High-Rise Urban Mixed-Use Complex",
    subtitle: "Zhengzhou, Henan Province，China",
    details: [
      { label: "Gross Floor Area:", value: "49,929.1 m²" },
      { label: "Number of Floors:", value: "22 Above Ground, 2 Below Ground" },
      { label: "Building Density:", value: "49.9%" },
      { label: "Completion Date:", value: "June 2025" }
    ]
  },
  2: {
    title: "Xiangning County Nursing Home",
    subtitle: "Linfen, Shanxi Province，China",
    details: [
      { label: "Number of Beds:", value: "200 Beds" },
      { label: "Gross Floor Area:", value: "Approximately 10,000 m²" },
      { label: "Completion Date:", value: "October 2025" }
    ]
  }
};

/* ============================
   PhotoItem 组件
   ============================ */
const PhotoItem = ({ index, config, smoothY, isExpanded, showText, smoothVelocity, galleryX }) => {
  const navigate = useNavigate();
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
  const startX = 0, startY = 45;

  const visualSlotIndex = { 1: 0, 0: 1, 4: 2, 3: 3, 2: 4 }[index];

  const getSlotState = (slot) => {
    const slots = [
      { x: -150, scale: 2.2, blur: 0, bright: 1, saturate: 1, opacity: 0 },
      { x: 0, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 },
      { x: 6, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 },
      { x: 12, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 },
      { x: 18, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 },
      { x: 24, scale: 1.5, blur: 0, bright: 1, saturate: 1, opacity: 1 }
    ];
    if (slot <= -0.6) return slots[0];
    if (slot >= 4) return slots[5];
    let lower = Math.max(0, Math.min(5, Math.floor(slot) + 1));
    let upper = Math.max(0, Math.min(5, Math.ceil(slot) + 1));
    const t = slot - Math.floor(slot);
    if (lower === upper) return slots[lower];
    return {
      x: lerp(slots[lower].x, slots[upper].x, t),
      scale: lerp(slots[lower].scale, slots[upper].scale, t),
      blur: lerp(slots[lower].blur, slots[upper].blur, t),
      bright: lerp(slots[lower].bright, slots[upper].bright, t),
      saturate: lerp(slots[lower].saturate, slots[upper].saturate, t),
      opacity: lerp(slots[lower].opacity, slots[upper].opacity, t)
    };
  };

  const [winWidth, setWinWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const expandX = useSpring(0, { stiffness: 50, damping: 15 });
  const expandProgress = useSpring(0, { stiffness: 50, damping: 15 });

  const baseOffset = Math.max(-200, 500 - (winWidth / 2));
  const expandedOffsetX = { 1: baseOffset, 0: baseOffset + 800, 4: baseOffset + 1600, 3: baseOffset + 2400, 2: baseOffset + 3200 }[index];

  useEffect(() => {
    expandX.set(isExpanded ? expandedOffsetX : 0);
    expandProgress.set(isExpanded ? 1 : 0);
  }, [isExpanded, expandedOffsetX, expandX, expandProgress]);

  const x = useTransform(() => {
    const yP = smoothY.get();
    const tx = getSlotState(visualSlotIndex).x;
    if (yP <= sprayStart) return startX + "vw";
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / sprayDuration;
      const e = easeInOut(t);
      const bow = Math.sin(t * Math.PI) * (config.scatterX * 0.35);
      return lerp(startX, config.scatterX, e) + bow + "vw";
    }
    if (yP < stackStart) return config.scatterX + "vw";
    if (yP < stackEnd) return lerp(config.scatterX, tx, (yP - stackStart) / (stackEnd - stackStart)) + "vw";
    return tx + "vw";
  });

  const y = useTransform(() => {
    const yP = smoothY.get();
    if (yP <= sprayStart) return startY + "vh";
    if (yP < sprayEnd) {
      const t = (yP - sprayStart) / sprayDuration;
      return lerp(startY, config.scatterY, easeInOut(t)) + "vh";
    }
    if (yP < stackStart) return config.scatterY + "vh";
    if (yP < stackEnd) return lerp(config.scatterY, 0, (yP - stackStart) / (stackEnd - stackStart)) + "vh";
    return "0vh";
  });

  const rotateZ = useTransform(() => {
    const yP = smoothY.get();
    if (yP <= sprayStart) return 0;
    if (yP < sprayEnd) return lerp(0, config.scatterR, easeInOut((yP - sprayStart) / sprayDuration));
    if (yP < stackStart) return config.scatterR;
    return lerp(config.scatterR, 0, (yP - stackStart) / (stackEnd - stackStart));
  });

  const scaleBase = useTransform(() => {
    const yP = smoothY.get();
    const prog = expandProgress.get();
    const target = getSlotState(visualSlotIndex).scale;

    let currentBase = target;
    if (yP <= sprayStart) {
      currentBase = 0.05;
    } else if (yP < sprayEnd) {
      currentBase = lerp(0.05, config.scatterS, easeInOut((yP - sprayStart) / sprayDuration));
    } else if (yP < stackStart) {
      currentBase = config.scatterS;
    } else if (yP < stackEnd) {
      currentBase = lerp(config.scatterS, target, (yP - stackStart) / (stackEnd - stackStart));
    }

    const expandedTarget = {
      1: 2.1,
      0: 1.6,
      4: 2.3,
      3: 1.7,
      2: 2.15
    }[index] ?? target;

    return lerp(currentBase, expandedTarget, prog);
  });

  const scaleX = useTransform(() => {
    const base = scaleBase.get();
    const yP = smoothY.get();
    const t = (yP - sprayStart) / sprayDuration;
    if (yP <= sprayStart || yP >= sprayEnd) return base;
    const maxAdd = { 4: 10, 0: 8, 3: 7 }[index] ?? 5;
    const stretch = t <= 0.2
      ? 1 + maxAdd * (1 - Math.pow(1 - t / 0.2, 2))
      : 1 + maxAdd * Math.pow(1 - (t - 0.2) / 0.8, 2);
    return base * stretch;
  });

  const scaleY = scaleX;

  const clipPathD = useTransform(() => {
    const yP = smoothY.get();
    const def = `M 0 0 C 0 0.3, 0 0.7, 0 1 L 1 1 C 1 0.7, 1 0.3, 1 0 Z`;
    if (yP <= sprayStart || yP >= sprayEnd) return def;
    const t = (yP - sprayStart) / sprayDuration;
    const e = easeInOut(t);
    const pinch = (7 / 15) * (1 - e);
    const shift = -config.scatterX * 0.015 * (1 - e);
    return `M 0 0 C 0 0.3, ${pinch + shift} 0.7, ${pinch + shift} 1 L ${1 - pinch + shift} 1 C ${1 - pinch + shift} 0.7, 1 0.3, 1 0 Z`;
  });

  const clipPathStyle = useTransform(() => {
    const yP = smoothY.get();
    return yP > sprayStart && yP < sprayEnd ? `url(#genie-clip-${index})` : "none";
  });

  const blurVal = useTransform(() => {
    const yP = smoothY.get();
    const tb = getSlotState(visualSlotIndex).blur;
    if (yP < stackStart) return 0;
    return yP < stackEnd ? lerp(0, tb, (yP - stackStart) / (stackEnd - stackStart)) : tb;
  });

  const brightVal = useTransform(() => {
    const yP = smoothY.get();
    const tb = getSlotState(visualSlotIndex).bright;
    if (yP < stackStart) return 1;
    return yP < stackEnd ? lerp(1, tb, (yP - stackStart) / (stackEnd - stackStart)) : tb;
  });

  const satVal = useTransform(() => {
    const yP = smoothY.get();
    const ts = getSlotState(visualSlotIndex).saturate;
    if (yP < stackStart) return 1;
    return yP < stackEnd ? lerp(1, ts, (yP - stackStart) / (stackEnd - stackStart)) : ts;
  });

  const opacity = useTransform(() => getSlotState(visualSlotIndex).opacity);
  const zIndex = useTransform(() => Math.round(30 - visualSlotIndex));
  const filter = useMotionTemplate`blur(${blurVal}px) brightness(${brightVal}) saturate(${satVal})`;

  const projectData = projectDataConfig[index];

  const lagX = useTransform(smoothVelocity, [-3000, 0, 3000], [120, 0, -120]);
  const rotateY = useTransform(smoothVelocity, [-3000, 0, 3000], [12, 0, -12]);
  const skewXLag = useTransform(smoothVelocity, [-3000, 0, 3000], [6, 0, -6]);

  const textLagX = useTransform(smoothVelocity, [-3000, 0, 3000], [60, 0, -60]);

  const titleLeft = useTransform(scaleX, s => -180 * s - 40);
  const titleTop = useTransform(scaleX, s => 120 * s - 60);

  const detailsLeft = useTransform(scaleX, s => 180 * s - 300 + 40);
  const detailsTop = useTransform(scaleX, s => -120 * s - 20);

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={`genie-clip-${index}`} clipPathUnits="objectBoundingBox">
            <motion.path d={clipPathD} />
          </clipPath>
        </defs>
      </svg>

      <motion.div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, x: expandX, zIndex, pointerEvents: 'none' }}>
        <motion.div style={{ position: 'absolute', left: '50vw', top: '50%', x, y }}>

          <motion.img
            src={config.image}
            alt={`Work ${index + 1}`}
            className="flying-photo"
            style={{
              position: 'absolute', marginLeft: -180, marginTop: -120, width: 360, height: 240,
              objectFit: 'cover', rotateZ, scaleX, scaleY, filter, opacity, clipPath: clipPathStyle,
              transformOrigin: "50% 50%", boxShadow: 'none', WebkitBoxShadow: 'none', pointerEvents: 'none',
              x: lagX,
              rotateY: rotateY,
              skewX: skewXLag,
              transformPerspective: 1000
            }}
          />

          <AnimatePresence>
            {showText && projectData && (
              <>
                <motion.div
                  key={`title-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  style={{ position: 'absolute', left: titleLeft, top: titleTop, width: 480, pointerEvents: 'none', x: textLagX }}
                >
                  <h2 style={{ fontSize: 22, margin: '0 0 6px', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                    <DecodeText text={projectData.title} />
                  </h2>
                  <h3 style={{ fontSize: 16, color: '#4a75ff', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                    <DecodeText text={projectData.subtitle} />
                  </h3>
                </motion.div>

                <motion.div
                  key={`data-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  style={{ position: 'absolute', left: detailsLeft, top: detailsTop, width: 300, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', gap: 16, x: textLagX }}
                >
                  {projectData.details.map((d, i) => (
                    <div key={i}>
                      <h4 style={{ fontSize: 14, margin: '0 0 4px', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                        <DecodeText text={d.label} />
                      </h4>
                      <p style={{ fontSize: 14, color: '#4a75ff', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif" }}>
                        <DecodeText text={d.value} />
                      </p>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      sessionStorage.setItem('returnToArchitecture', 'true');
                      sessionStorage.setItem('architectureGalleryX', galleryX.get());
                      navigate(`/project/Project${index + 1}`);
                    }}
                    style={{
                      marginTop: 12, padding: '8px 24px', backgroundColor: '#001ede', color: 'white',
                      border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-end',
                      fontFamily: "'SansSerifFLF', sans-serif", pointerEvents: 'auto'
                    }}
                  >Details</button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
};

/* ============================
   ArchitectureWorks 主组件
   ============================ */
export default function ArchitectureWorks() {
  const containerRef = useRef(null);
  const galleryX = useMotionValue(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const isExpandedRef = useRef(false);

  const lenis = useLenis();

  const galleryVelocity = useVelocity(galleryX);
  const smoothVelocity = useSpring(galleryVelocity, { stiffness: 80, damping: 15 });

  const snapAnimRef = useRef(null);
  const isSnapping = useRef(false);
  const inertiaRef = useRef(null);
  const exitAnimRef = useRef(null);

  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startGX: 0,
    lastTime: 0,
    lastX: 0,
    velocity: 0
  });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(smoothY, "change", (latest) => {
    const expanded = latest >= 0.89;
    const wasExpanded = isExpandedRef.current;
    setIsExpanded(expanded);
    isExpandedRef.current = expanded;

    if (expanded) {
      snapAnimRef.current?.stop();
      exitAnimRef.current?.stop();
    } else if (wasExpanded && !expanded) {
      inertiaRef.current?.stop();
      exitAnimRef.current?.stop();
      dragRef.current.isDown = false;

      const currentX = galleryX.get();
      if (currentX !== 0) {
        exitAnimRef.current = animate(currentX, 0, {
          type: "spring",
          stiffness: 120,
          damping: 18,
          onUpdate: v => galleryX.set(v),
          onComplete: () => {
            exitAnimRef.current = null;
          }
        });
      }
    }
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isExpandedRef.current) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const cur = galleryX.get();
        let next = cur - e.deltaX * 0.8;
        next = Math.max(-3200, Math.min(0, next));
        galleryX.set(next);
      }
    };

    // 修复：局部作用域监听，不再影响全局
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [galleryX]);

  useEffect(() => {
    const timer = isExpanded ? setTimeout(() => setShowText(true), 800) : undefined;
    if (!isExpanded) setShowText(false);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  useLayoutEffect(() => {
    if (sessionStorage.getItem('returnToArchitecture') === 'true') {
      const savedX = sessionStorage.getItem('architectureGalleryX');
      if (savedX !== null) {
        galleryX.jump(parseFloat(savedX));
      }
      const el = containerRef.current;
      if (el) {
        const targetScroll = el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.95;
        window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
        smoothY.jump(0.95);
      }
    }
  }, [smoothY, galleryX]);

  useEffect(() => {
    if (sessionStorage.getItem('returnToArchitecture') === 'true') {
      if (lenis) {
        sessionStorage.removeItem('returnToArchitecture');
        sessionStorage.removeItem('architectureGalleryX');
        const el = containerRef.current;
        if (el) {
          const targetScroll = el.offsetTop + (el.offsetHeight - window.innerHeight) * 0.95;
          lenis.scrollTo(targetScroll, { immediate: true });
          smoothY.jump(0.95);
        }
      }
    }
  }, [lenis, smoothY]);

  useEffect(() => {
    let timeout;
    const handle = () => {
      if (isSnapping.current) return;
      const p = scrollYProgress.get();
      if (p > 0.55 && p < 0.95) {
        isSnapping.current = true;
        const ct = containerRef.current;
        const maxScroll = ct.offsetHeight - window.innerHeight;
        const targetP = p < 0.88 ? 0.81 : 0.90;
        const targetScroll = ct.offsetTop + maxScroll * targetP;
        snapAnimRef.current = animate(window.scrollY, targetScroll, {
          type: "spring", stiffness: 50, damping: 20,
          onUpdate: v => window.scrollTo(0, v),
          onComplete: () => { isSnapping.current = false; }
        });
      }
    };
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handle, 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollYProgress]);

  const onPointerDown = useCallback((e) => {
    if (!isExpandedRef.current) return;
    e.preventDefault();
    inertiaRef.current?.stop();
    exitAnimRef.current?.stop();

    const t = Date.now();
    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startGX: galleryX.get(),
      lastTime: t,
      lastX: e.clientX,
      velocity: 0
    };
  }, [galleryX]);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current.isDown) return;
    const now = Date.now();
    const dx = e.clientX - dragRef.current.startX;
    let newX = dragRef.current.startGX + dx;
    newX = Math.max(-3200, Math.min(0, newX));
    galleryX.set(newX);

    if (now - dragRef.current.lastTime > 16) {
      const dt = now - dragRef.current.lastTime;
      if (dt > 0) {
        dragRef.current.velocity = (e.clientX - dragRef.current.lastX) / dt;
      }
      dragRef.current.lastTime = now;
      dragRef.current.lastX = e.clientX;
    }
  }, [galleryX]);

  const onPointerUp = useCallback(() => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;

    const inertiaFactor = 0.12;
    const currentX = galleryX.get();
    const velocity = dragRef.current.velocity * 100;
    let targetX = currentX + velocity * inertiaFactor;
    targetX = Math.max(-3200, Math.min(0, targetX));

    inertiaRef.current = animate(currentX, targetX, {
      type: "spring",
      stiffness: 120,
      damping: 18,
      onUpdate: v => galleryX.set(v),
      onComplete: () => { }
    });
  }, [galleryX]);

  useEffect(() => {
    const onMove = (e) => onPointerMove(e);
    const onUp = () => onPointerUp();
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [onPointerMove, onPointerUp]);

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
      <div className="sticky-viewport"
        onPointerDown={onPointerDown}
        style={{ touchAction: 'none', cursor: isExpanded ? 'grab' : 'default', perspective: 1500 }}
      >
        <div style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '14vw',
          fontWeight: 'bold',
          color: '#1b1965',
          zIndex: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontFamily: "'Dela Gothic One', cursive, sans-serif"
        }}>
          Architecture
        </div>

        <motion.div className="folder-piece"
          style={{ y: folderY, opacity: folderOpacity, zIndex: 10, pointerEvents: isExpanded ? 'none' : 'auto' }}>
          <div className="folder-tab"></div>
          <div className="folder-back-bg"></div>
        </motion.div>

        <motion.div className="folder-aurora-glow"
          style={{
            position: 'absolute', left: '50%', bottom: '-5vh', width: '70vw', height: '45vh', x: '-50%',
            y: folderY,
            background: 'radial-gradient(ellipse at 50% 80%, rgba(82,17,221,0.95) 0%, rgba(82,17,221,0.5) 45%, rgba(0,0,0,0) 70%)',
            filter: useMotionTemplate`blur(45px) brightness(${auroraBrightness})`,
            opacity: folderOpacity, zIndex: 15, pointerEvents: isExpanded ? 'none' : 'auto', mixBlendMode: 'screen'
          }}
        />

        <motion.div style={{
          x: galleryX,
          position: 'absolute', left: 0, top: 0, width: '100vw', height: '100%', zIndex: 20,
          pointerEvents: 'none'
        }}>
          {scatterConfigs.map((cfg, idx) => (
            <PhotoItem
              key={idx}
              index={idx}
              config={cfg}
              smoothY={smoothY}
              isExpanded={isExpanded}
              showText={showText}
              smoothVelocity={smoothVelocity}
              galleryX={galleryX}
            />
          ))}
        </motion.div>

        <motion.div className="folder-front-glass"
          style={{
            y: folderY, opacity: folderOpacity, rotateX: folderRotateX,
            transformOrigin: "bottom center", zIndex: 50, pointerEvents: isExpanded ? 'none' : 'auto'
          }}>
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