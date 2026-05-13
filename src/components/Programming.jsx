import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useInView, useMotionValue, animate, motion, useTransform, useMotionTemplate } from 'framer-motion';
import './programming.css';

// 🌟 1. 引入经过 FFmpeg 优化后的视频文件
import Video2 from '../assets/Video2_web.mp4';
import ClipoInterface from '../assets/ClipoInterface.png';
import Bar from '../assets/Bar.png';
import HistoryImg from '../assets/HistoryWindow.png';
import Macbook from '../assets/Macbook.png';
import iMacImg from '../assets/iMac.png';
import MacstudioImg from '../assets/Macstudio.png';
import GithubIcon from '../assets/Github.png';
import FileIcon from '../assets/File.png';
import PlaycircleIcon from '../assets/Playcircle.png';

export default function Programming() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const isInView = useInView(sectionRef, { amount: 0.25 });
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  const [showBarContent, setShowBarContent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [fadeOutAll, setFadeOutAll] = useState(false);

  const [animationPhase, setAnimationPhase] = useState('idle');
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);

  const rippleScale = useMotionValue(0);
  const noiseOffsetY = useMotionValue(0);
  
  const containerScale = useMotionValue(1);
  const containerX = useMotionValue('0vw');
  const containerY = useMotionValue('0vh');
  const macbookOpacity = useMotionValue(0);

  const imacX = useMotionValue('calc(-50% - 100vw)'); 
  const imacY = useMotionValue('-50%'); 
  const imacOpacity = useMotionValue(0);

  const macStudioX = useMotionValue('calc(-50% + 100vw)'); 
  const macStudioY = useMotionValue('-50%'); 
  const macStudioOpacity = useMotionValue(0);

  const syncTextOpacity = useMotionValue(0);
  const syncTextBlur = useMotionValue(20);
  const syncTextX = useMotionValue('-50%'); 
  const syncTextY = useMotionValue('-50%'); 
  const syncTextBlurString = useTransform(syncTextBlur, (v) => `blur(${v}px)`);

  const sweepPercent = useMotionValue(-20);
  const stop1 = useTransform(sweepPercent, v => `${v - 20}%`); 
  const stop2 = useTransform(sweepPercent, v => `${v - 10}%`);  
  const stop3 = useTransform(sweepPercent, v => `${v}%`);      
  const stop4 = useTransform(sweepPercent, v => `${v + 15}%`); 
  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #0016d8 ${stop2}, #0016d8 ${stop3}, rgba(255,255,255,0.15) ${stop4})`;

  const sweep2TextOpacity = useMotionValue(0);
  const sweep2TextBlur = useMotionValue(20);
  const sweep2TextBlurString = useTransform(sweep2TextBlur, (v) => `blur(${v}px)`);
  const sweep2Percent = useMotionValue(-20);
  const sweep2Stop1 = useTransform(sweep2Percent, v => `${v - 20}%`);
  const sweep2Stop2 = useTransform(sweep2Percent, v => `${v - 10}%`);
  const sweep2Stop3 = useTransform(sweep2Percent, v => `${v}%`);
  const sweep2Stop4 = useTransform(sweep2Percent, v => `${v + 15}%`);
  const animatedGradient2 = useMotionTemplate`linear-gradient(to right, #ffffff ${sweep2Stop1}, #0016d8 ${sweep2Stop2}, #0016d8 ${sweep2Stop3}, rgba(255,255,255,0.15) ${sweep2Stop4})`;

  const buttonsOpacity = useMotionValue(0);
  const buttonsBlur = useMotionValue(20);
  const buttonsBlurString = useTransform(buttonsBlur, (v) => `blur(${v}px)`);
  const buttonsX = useMotionValue('-50%');
  const buttonsY = useMotionValue('-50%');

  const playIconOpacity = useMotionValue(0);
  const playIconBlur = useMotionValue(20);
  const playIconBlurString = useTransform(playIconBlur, (v) => `blur(${v}px)`);

  const getLayoutPositions = (isMobile) => {
    if (isMobile) {
      const wHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;
      const baseWidth = Math.max(wHeight, 400) * (16 / 9);
      const targetWidth = 320; 
      const dynamicScale = targetWidth / baseWidth;

      return {
        containerScale: dynamicScale, containerX: '0vw', containerY: '-16vh',
        imacX: '-50%', imacY: '-50%', imacFinalOpacity: 0, 
        macStudioX: 'calc(-50% + 28vw)', macStudioY: 'calc(-50% - 7vh)', 
        text1X: '-50%', text1Y: 'calc(-50% + 10vh)',
        buttonsX: '-50%', buttonsY: 'calc(-50% + 10vh + 35vw)' 
      };
    } else {
      return {
        containerScale: 0.252, containerX: '-14vw', containerY: '6.7vw', 
        imacX: 'calc(-50% - 30vw)', imacY: 'calc(-50% + 0.5vw)', imacFinalOpacity: 1, 
        macStudioX: 'calc(-50% - 2vw)', macStudioY: 'calc(-50% + 12.3vw)', 
        text1X: 'calc(-50% + 30vw)', text1Y: 'calc(-50% - 4vw)', 
        buttonsX: 'calc(-50% + 30vw)', buttonsY: 'calc(-50% + 13.5vw)' 
      };
    }
  };

  const applyFinalLayout = useCallback((instant = false) => {
    const layout = getLayoutPositions(isMobileRef.current);
    const duration = instant ? 0.01 : 1.2;
    const ease = [0.85, 0, 0.15, 1];

    animate(containerScale, layout.containerScale, { duration, ease });
    animate(containerX, layout.containerX, { duration, ease });
    animate(containerY, layout.containerY, { duration, ease });
    animate(macbookOpacity, 1, { duration, ease });

    animate(imacX, layout.imacX, { duration, ease });
    animate(imacY, layout.imacY, { duration, ease });
    animate(imacOpacity, layout.imacFinalOpacity, { duration, ease });

    animate(macStudioX, layout.macStudioX, { duration, ease });
    animate(macStudioY, layout.macStudioY, { duration, ease });
    animate(macStudioOpacity, 1, { duration, ease });

    animate(syncTextX, layout.text1X, { duration: 0.01 });
    animate(syncTextY, layout.text1Y, { duration: 0.01 });
    animate(buttonsX, layout.buttonsX, { duration: 0.01 });
    animate(buttonsY, layout.buttonsY, { duration: 0.01 });
  }, [containerScale, containerX, containerY, macbookOpacity, imacX, imacY, imacOpacity, macStudioX, macStudioY, macStudioOpacity, syncTextX, syncTextY, buttonsX, buttonsY]);

  useEffect(() => {
    const handleResize = () => {
      isMobileRef.current = window.innerWidth <= 900;
      if (animationPhase === 'finished') {
        applyFinalLayout(true); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [animationPhase, applyFinalLayout]);

  useEffect(() => {
    if (isInView && !videoPlaying && !videoEnded) {
      setVideoPlaying(true);
      videoRef.current?.play();
    }
  }, [isInView, videoPlaying, videoEnded]);

  useEffect(() => {
    if (!videoEnded) return;

    const t1 = setTimeout(() => setShowBarContent(true), 3700);
    const t2 = setTimeout(() => setShowHistory(true), 4150);
    
    const t3 = setTimeout(() => {
      setIsRippling(true);
      setIsGlowActive(true);
      animate(rippleScale, [0, 45, 0], { duration: 0.8, ease: "easeInOut" });
      animate(noiseOffsetY, [0, -1200], { duration: 0.8, ease: "linear" });
      animate(containerScale, [1, 1.04, 1], { duration: 0.8, ease: "easeInOut" });
      setTimeout(() => setIsRippling(false), 800);
    }, 6150);

    const t4 = setTimeout(() => setFadeOutAll(true), 11650);

    const t5 = setTimeout(() => {
      setAnimationPhase('finished');
      applyFinalLayout(false); 

      setTimeout(() => {
        animate(syncTextOpacity, 1, { duration: 0.8 });
        animate(syncTextBlur, 0, { duration: 0.8 });
        animate(sweepPercent, 130, { duration: 2.2, ease: "easeInOut" });

        setTimeout(() => {
          animate(syncTextOpacity, 0, { duration: 0.8 });
          animate(syncTextBlur, 20, { duration: 0.8 });

          setTimeout(() => {
            animate(sweep2TextOpacity, 1, { duration: 0.8 });
            animate(sweep2TextBlur, 0, { duration: 0.8 });
            animate(sweep2Percent, 130, { duration: 2.2, ease: "easeInOut" });

            animate(buttonsOpacity, 1, { duration: 0.8 });
            animate(buttonsBlur, 0, { duration: 0.8 });
            animate(playIconOpacity, 1, { duration: 0.8 });
            animate(playIconBlur, 0, { duration: 0.8 });

          }, 800);
        }, 4200);
      }, 1200);

    }, 13150);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, [videoEnded, applyFinalLayout, containerScale, rippleScale, noiseOffsetY, syncTextOpacity, syncTextBlur, sweepPercent, sweep2TextOpacity, sweep2TextBlur, sweep2Percent, buttonsOpacity, buttonsBlur, playIconOpacity, playIconBlur]); 

  const handleReset = useCallback(() => {
    setAnimationPhase('idle');
    animate(syncTextOpacity, 0, { duration: 0.01 });
    animate(syncTextBlur, 20, { duration: 0.01 });
    animate(sweepPercent, -20, { duration: 0.01 });
    animate(sweep2TextOpacity, 0, { duration: 0.01 });
    animate(sweep2TextBlur, 20, { duration: 0.01 });
    animate(sweep2Percent, -20, { duration: 0.01 });
    animate(buttonsOpacity, 0, { duration: 0.01 });
    animate(buttonsBlur, 20, { duration: 0.01 });
    animate(playIconOpacity, 0, { duration: 0.01 });
    animate(playIconBlur, 20, { duration: 0.01 });
    
    animate(containerScale, 1, { duration: 0.01 });
    animate(containerX, '0vw', { duration: 0.01 });
    animate(containerY, '0vh', { duration: 0.01 });
    animate(macbookOpacity, 0, { duration: 0.01 });
    
    animate(imacX, 'calc(-50% - 100vw)', { duration: 0.01 });
    animate(imacY, '-50%', { duration: 0.01 });
    animate(imacOpacity, 0, { duration: 0.01 });
    
    animate(macStudioX, 'calc(-50% + 100vw)', { duration: 0.01 });
    animate(macStudioY, '-50%', { duration: 0.01 });
    animate(macStudioOpacity, 0, { duration: 0.01 });
    
    setVideoPlaying(false);
    setVideoEnded(false);
    setShowBarContent(false);
    setShowHistory(false);
    setIsRippling(false);
    setIsGlowActive(false);
    setFadeOutAll(false);
    
    setVideoPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [syncTextOpacity, syncTextBlur, sweepPercent, sweep2TextOpacity, sweep2TextBlur, sweep2Percent, buttonsOpacity, buttonsBlur, playIconOpacity, playIconBlur, containerScale, containerX, containerY, macbookOpacity, imacX, imacY, imacOpacity, macStudioX, macStudioY, macStudioOpacity]);

  return (
    <section id="programming" className="programming-page" ref={sectionRef}>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="water-ripple" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency="0.0005 0.002" numOctaves="1" result="noise" />
            <motion.feOffset in="noise" dy={noiseOffsetY} result="movingNoise" />
            <motion.feDisplacementMap in="SourceGraphic" in2="movingNoise" scale={rippleScale} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="programming-video-container">
        <motion.img 
          src={iMacImg} alt="iMac" className="apple-imac-layer"
          style={{ x: imacX, y: imacY, opacity: imacOpacity }}
        />

        <motion.div 
          className="video-tight-wrapper"
          style={{ filter: isRippling ? 'url(#water-ripple)' : 'none', scale: containerScale, x: containerX, y: containerY, z: 0, willChange: isRippling ? 'filter, transform' : 'auto' }}
        >
          {/* 🌟 2. 极致优化的 video 标签 */}
          <video 
            ref={videoRef} 
            src={Video2} 
            className="programming-scroll-video" 
            preload="metadata" /* 将 auto 改为 metadata 释放内存 */
            muted 
            playsInline 
            onEnded={() => setVideoEnded(true)}
            style={{ 
              willChange: 'transform', 
              transform: 'translateZ(0)' /* 强制 GPU 硬件加速 */
            }} 
          />

          <div className={`video-glow-overlay ${isGlowActive ? 'glow-active' : ''} ${fadeOutAll ? 'fade-out-all' : ''}`}>
            <div className="glow-system">
              <div className="glow-color glow-color-1"></div>
              <div className="glow-color glow-color-2"></div>
              <div className="glow-black-hole"></div>
            </div>
          </div>

          {showBarContent && (
            <div className={`bar-content-wrapper ${showHistory ? 'bar-exit' : ''}`}>
              <div className="bar-title-wrapper"><p className="bar-title">AI-Sorted Clipboard History</p></div>
              <div className="bar-image-wrapper"><img src={Bar} alt="Bar" className="bar-image" /></div>
            </div>
          )}

          {showHistory && (
            <div className={`history-layout-container ${fadeOutAll ? 'fade-out-all' : ''}`}>
              <div className="history-left-side"><img src={HistoryImg} alt="History Window" className="history-window-image" /></div>
              <div className="history-right-side"><p className="powered-by-text">Powered by<br/>AI</p></div>
            </div>
          )}

          <motion.img 
            src={Macbook} alt="Macbook Overlay" className="macbook-overlay-image" 
            style={{ opacity: macbookOpacity, top: '50%', left: '50%', x: '-49.8%', y: '-44.4%' }} 
          />
        </motion.div>

        <motion.img 
          src={MacstudioImg} alt="Mac Studio" className="apple-macstudio-layer"
          style={{ x: macStudioX, y: macStudioY, opacity: macStudioOpacity }}
        />

        <motion.div 
          className="sync-text-container"
          style={{ opacity: syncTextOpacity, x: syncTextX, y: syncTextY, filter: syncTextBlurString }}
        >
          <motion.h2 style={{ backgroundImage: animatedGradient }}>Seamlessly<br/>sync across<br/>your Macs</motion.h2>
        </motion.div>

        <motion.div 
          className="sync-text-container sync-text-second"
          style={{ opacity: sweep2TextOpacity, x: syncTextX, y: syncTextY, filter: sweep2TextBlurString }}
        >
          <motion.h2 style={{ backgroundImage: animatedGradient2 }}>Clipo is free<br/>and open-source</motion.h2>
        </motion.div>

        <motion.div 
          className="sweep2-buttons-row"
          style={{ opacity: buttonsOpacity, filter: buttonsBlurString, x: buttonsX, y: buttonsY }}
        >
          <motion.button className="sweep2-btn" initial="rest" whileHover="hover" animate="rest" variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}>
            <motion.div variants={{ rest: { width: "auto", opacity: 1 }, hover: { width: 0, opacity: 0 } }} transition={{ type: "spring", stiffness: 400, damping: 22 }} style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'max-content' }}><img src={GithubIcon} alt="Github" className="sweep2-btn-icon" /><span>Github</span></div>
            </motion.div>
            <motion.div variants={{ rest: { width: 0, opacity: 0 }, hover: { width: "auto", opacity: 1 } }} transition={{ type: "spring", stiffness: 400, damping: 22 }} style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ width: 'max-content' }}><span className="sweep2-btn-hover-text">Available Soon</span></div>
            </motion.div>
          </motion.button>
          
          <motion.button className="sweep2-btn" initial="rest" whileHover="hover" animate="rest" variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}>
            <motion.div variants={{ rest: { width: "auto", opacity: 1 }, hover: { width: 0, opacity: 0 } }} transition={{ type: "spring", stiffness: 400, damping: 22 }} style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: 'max-content' }}><img src={FileIcon} alt="File" className="sweep2-btn-icon" /><span>dmg</span></div>
            </motion.div>
            <motion.div variants={{ rest: { width: 0, opacity: 0 }, hover: { width: "auto", opacity: 1 } }} transition={{ type: "spring", stiffness: 400, damping: 22 }} style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
              <div style={{ width: 'max-content' }}><span className="sweep2-btn-hover-text">Available Soon</span></div>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
      
      {videoEnded && (
        <div className={`clipo-interface-wrapper ${showBarContent ? 'clipo-exit' : ''} ${fadeOutAll ? 'fade-out-all' : ''}`}>
          <div className="clipo-text-group"><p className="clipo-text-top">Vibe-Coding Works</p><p className="clipo-text-bottom">Clipo</p></div>
          <img src={ClipoInterface} alt="Clipo Interface" className="clipo-interface-image" />
        </div>
      )}

      <motion.div 
        className="programming-play-container"
        style={{ opacity: playIconOpacity, filter: playIconBlurString }}
      >
        <span className="programming-play-label">Replay</span>
        <div className="programming-play-icon" onClick={handleReset}><img src={PlaycircleIcon} alt="Replay" /></div>
      </motion.div>
    </section>
  );
}