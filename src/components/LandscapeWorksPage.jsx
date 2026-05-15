import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  animate,
  useVelocity,
  useMotionValue
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { useTranslation } from 'react-i18next';
import './landscapeWorksPage.css';

import LProject1 from "../assets/LProject1.png";
import LProject2 from "../assets/LProject2.png";
import LProject3 from "../assets/LProject3.png";
import LProject4 from "../assets/LProject4.png";
import LProject5 from "../assets/LProject5.png";

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
        const isNonAscii = text.charCodeAt(i) > 127;
        if (iteration < i) {
          newElements.push(<span key={i} style={{ visibility: "hidden" }}>{text[i]}</span>);
        } else if (iteration >= i + lag) {
          newElements.push(<span key={i}>{text[i]}</span>);
        } else {
          if (text[i] === ' ' || text[i] === '\n') {
            newElements.push(<span key={i}>{text[i]}</span>);
          } else if (isNonAscii) {
            newElements.push(<span key={i}>{text[i]}</span>);
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
    <span className={`decode-text-container ${className}`} style={{
      fontFamily: "'SansSerifFLF', sans-serif",
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      cursor: "default", display: "inline-block", ...style
    }}>
      {renderedElements.length > 0 ? renderedElements : <span style={{ visibility: 'hidden' }}>{text}</span>}
    </span>
  );
};

const getProjectDataConfig = (t) => ({
  0: {
    title: t('landscape.project1.title'),
    subtitle: t('landscape.project1.subtitle'),
    details: [
      { label: t('landscape.project1.label1'), value: t('landscape.project1.value1') },
      { label: t('landscape.project1.label2'), value: t('landscape.project1.value2') },
      { label: t('landscape.project1.label3'), value: t('landscape.project1.value3') }
    ]
  },
  1: {
    title: t('landscape.project2.title'),
    subtitle: t('landscape.project2.subtitle'),
    details: [
      { label: t('landscape.project2.label1'), value: t('landscape.project2.value1') },
      { label: t('landscape.project2.label2'), value: t('landscape.project2.value2') },
      { label: t('landscape.project2.label3'), value: t('landscape.project2.value3') }
    ]
  },
  2: {
    title: t('landscape.project3.title'),
    subtitle: t('landscape.project3.subtitle'),
    details: [
      { label: t('landscape.project3.label1'), value: t('landscape.project3.value1') },
      { label: t('landscape.project3.label2'), value: t('landscape.project3.value2') },
      { label: t('landscape.project3.label3'), value: t('landscape.project3.value3') }
    ]
  },
  3: {
    title: t('landscape.project4.title'),
    subtitle: t('landscape.project4.subtitle'),
    details: [
      { label: t('landscape.project4.label1'), value: t('landscape.project4.value1') },
      { label: t('landscape.project4.label2'), value: t('landscape.project4.value2') },
      { label: t('landscape.project4.label3'), value: t('landscape.project4.value3') }
    ]
  },
  4: {
    title: t('landscape.project5.title'),
    subtitle: t('landscape.project5.subtitle'),
    details: [
      { label: t('landscape.project5.label1'), value: t('landscape.project5.value1') },
      { label: t('landscape.project5.label2'), value: t('landscape.project5.value2') }
    ]
  }
});

const PhotoItem = ({ index, config, galleryX, smoothVelocity, sectionProgress }) => {
  const scale = index === 0 ? 2.5 : index === 2 ? 1.7 : 2.05;
  const baseRotateZ = { 0: 4, 1: -3, 2: 5, 3: -2, 4: 3 }[index];

  const lagX = useTransform(smoothVelocity, [-3000, 0, 3000], [120, 0, -120]);
  const rotateY = useTransform(smoothVelocity, [-3000, 0, 3000], [12, 0, -12]);
  const skewXLag = useTransform(smoothVelocity, [-3000, 0, 3000], [6, 0, -6]);

  const parallaxMultiplier = { 0: 90, 1: -160, 2: 220, 3: -110, 4: 170 }[index];
  const parallaxY = useTransform(sectionProgress, [0, 1], [-parallaxMultiplier, parallaxMultiplier]);

  const wrapperX = useTransform(galleryX, v => `calc(${v}px + 50vw - 560px - ${index * 850}px)`);
  const zIndex = 30 - index;

  return (
    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, x: wrapperX, y: parallaxY, zIndex, pointerEvents: 'none' }}>
      <motion.div style={{ position: 'absolute', left: '50vw', top: '50%' }}>
        <motion.img
          src={config.image}
          alt={`Work ${index + 1}`}
          className="flying-photo"
          style={{
            position: 'absolute', marginLeft: -180, marginTop: -120, width: 360, height: 240,
            objectFit: 'cover', scale, rotateZ: baseRotateZ, transformOrigin: "50% 50%", pointerEvents: 'none',
            x: lagX,
            rotateY: rotateY,
            skewX: skewXLag,
            transformPerspective: 1000,
            boxShadow: 'none',
            WebkitBoxShadow: 'none',
            z: 0, // 🌟 使用原生方式触发 GPU 层
            willChange: 'transform'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const PhotoTextItem = ({ index, galleryX, smoothVelocity, sectionProgress, t }) => {
  const navigate = useNavigate();
  const scale = index === 0 ? 2.5 : index === 2 ? 1.7 : 2.05;
  const projectData = getProjectDataConfig(t)[index];

  const textLagX = useTransform(smoothVelocity, [-3000, 0, 3000], [60, 0, -60]);
  const wrapperX = useTransform(galleryX, v => `calc(${v}px + 50vw - 560px - ${index * 850}px)`);

  const titleLeft = -180 * scale - 40;
  const titleTop = -120 * scale - 60;
  const detailsLeft = 180 * scale - 320 + 40;
  const detailsTop = 120 * scale - 180;

  const parallaxMultiplier = { 0: 90, 1: -160, 2: 220, 3: -110, 4: 170 }[index];
  const parallaxY = useTransform(sectionProgress, [0, 1], [-parallaxMultiplier, parallaxMultiplier]);

  if (!projectData) return null;

  return (
    <motion.div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, x: wrapperX, y: parallaxY, pointerEvents: 'none' }}>
      <motion.div style={{ position: 'absolute', left: '50vw', top: '50%' }}>
        <motion.div
          style={{ position: 'absolute', left: titleLeft, top: titleTop, width: 340, pointerEvents: 'none', x: textLagX }}
        >
          <h2 style={{ fontSize: 24, margin: '0 0 6px', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
            <DecodeText text={projectData.title} />
          </h2>
          <h3 style={{ fontSize: 16, color: '#4a75ff', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
            <DecodeText text={projectData.subtitle} />
          </h3>
        </motion.div>

        <motion.div
          style={{ position: 'absolute', left: detailsLeft, top: detailsTop, width: 320, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', gap: 16, x: textLagX }}
        >
          {projectData.details.map((d, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 14, margin: '0 0 4px', fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                <DecodeText text={d.label} />
              </h4>
              <p style={{ fontSize: 14, color: '#4a75ff', margin: 0, fontWeight: 'bold', fontFamily: "'SansSerifFLF', sans-serif", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
                <DecodeText text={d.value} />
              </p>
            </div>
          ))}
          <button
            onClick={() => {
              sessionStorage.setItem('returnToLandscape', 'true');
              sessionStorage.setItem('landscapeGalleryX', galleryX.get());
              navigate(`/project/LProject${index + 1}`);
            }}
            style={{
              marginTop: 12, padding: '8px 24px', backgroundColor: '#001ede', color: 'white',
              border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-end',
              fontFamily: "'SansSerifFLF', sans-serif", pointerEvents: 'auto',
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
            }}>{t('landscape.details')}</button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default function LandscapeWorksPage() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const galleryX = useMotionValue(0);
  const lenis = useLenis();

  const galleryVelocity = useVelocity(galleryX);
  const smoothVelocity = useSpring(galleryVelocity, { stiffness: 80, damping: 15 });

  const inertiaRef = useRef(null);

  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startGX: 0,
    lastTime: 0,
    lastX: 0,
    velocity: 0
  });

  useEffect(() => {
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const cur = galleryX.get();
        let next = cur - e.deltaX * 0.8;
        next = Math.max(0, Math.min(3400, next));
        galleryX.set(next);
      }
    };

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

  const onPointerDown = useCallback((e) => {
    e.preventDefault();
    inertiaRef.current?.stop();

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

    newX = Math.max(0, Math.min(3400, newX));
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

    targetX = Math.max(0, Math.min(3400, targetX));

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

  useLayoutEffect(() => {
    if (sessionStorage.getItem('returnToLandscape') === 'true') {
      const savedX = sessionStorage.getItem('landscapeGalleryX');
      if (savedX !== null) {
        galleryX.jump(parseFloat(savedX));
      }
      const el = containerRef.current;
      if (el) {
        const targetScroll = el.offsetTop;
        window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });
      }
    }
  }, [galleryX]);

  useEffect(() => {
    if (sessionStorage.getItem('returnToLandscape') === 'true') {
      if (lenis) {
        sessionStorage.removeItem('returnToLandscape');
        sessionStorage.removeItem('landscapeGalleryX');
        const el = containerRef.current;
        if (el) {
          const targetScroll = el.offsetTop;
          lenis.scrollTo(targetScroll, { immediate: true });
        }
      }
    }
  }, [lenis]);

  const scatterConfigs = [
    { image: LProject1 },
    { image: LProject2 },
    { image: LProject3 },
    { image: LProject4 },
    { image: LProject5 }
  ];

  const { scrollYProgress: enterProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(enterProgress, [0, 1], ["-10vh", "-130%"]);
  const lightPercent = useTransform(enterProgress, [0, 0.5], [-20, 120]);
  const stop1 = useTransform(lightPercent, v => `${v - 15}%`);
  const stop2 = useTransform(lightPercent, v => `${v - 5}%`);
  const stop3 = useTransform(lightPercent, v => `${v}%`);
  const stop4 = useTransform(lightPercent, v => `${v + 10}%`);
  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #8599d2 ${stop2}, #0016d8 ${stop3}, rgba(0, 22, 216, 0) ${stop4})`;

  return (
    <section id="landscape" className="landscape-portfolio-section" ref={containerRef} style={{ height: '100vh', backgroundColor: '#000', position: 'relative', width: '100%', overflow: 'visible', zIndex: 150 }}>
      
      <div className="landscape-hint-text">
        {t('landscape.swipeHint')}
      </div>
      <motion.div
        style={{
          y: textY,
          position: 'absolute',
          top: 0,
          left: 0,
          paddingLeft: '40px',
          zIndex: 60,
          pointerEvents: 'none'
        }}
      >
        <motion.h1
          className="landscape-main-title"
          style={{ backgroundImage: animatedGradient }}
        >
          Landscape<br />Works
        </motion.h1>
      </motion.div>

      <div
        onPointerDown={onPointerDown}
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, touchAction: 'none', cursor: 'grab', perspective: 1500, overflow: 'hidden' }}
      >
        <div className="landscape-bg-text">
          Landscape
        </div>

        <motion.div style={{
          x: 0,
          position: 'absolute', left: 0, top: 0, width: '100vw', height: '100%', zIndex: 20,
          pointerEvents: 'none'
        }}>
          {scatterConfigs.map((cfg, idx) => (
            <PhotoItem
              key={idx}
              index={idx}
              config={cfg}
              galleryX={galleryX}
              smoothVelocity={smoothVelocity}
              sectionProgress={sectionProgress}
            />
          ))}
        </motion.div>

        <motion.div style={{
          x: 0,
          position: 'absolute', left: 0, top: 0, width: '100vw', height: '100%', zIndex: 40,
          pointerEvents: 'none'
        }}>
          {scatterConfigs.map((cfg, idx) => (
            <PhotoTextItem
              key={`text-${idx}`}
              index={idx}
              galleryX={galleryX}
              smoothVelocity={smoothVelocity}
              sectionProgress={sectionProgress}
              t={t}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}