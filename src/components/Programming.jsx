import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent, useMotionValue, animate, motion, useTransform, useMotionTemplate } from 'framer-motion';
import './programming.css';

// 引入资源
import Video2 from '../assets/Video2.mp4';
import ClipoInterface from '../assets/ClipoInterface.png';
import Bar from '../assets/Bar.png';
import HistoryImg from '../assets/HistoryWindow.png';
import Macbook from '../assets/Macbook.png';
import iMacImg from '../assets/iMac.png';
import MacstudioImg from '../assets/Macstudio.png';

export default function Programming() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  const [showBarContent, setShowBarContent] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isRippling, setIsRippling] = useState(false);
  const [isGlowActive, setIsGlowActive] = useState(false);
  const [fadeOutAll, setFadeOutAll] = useState(false);

  const rippleScale = useMotionValue(0);
  const noiseOffsetY = useMotionValue(0);
  
  // 🌟 主容器 (Video + MacBook)
  const containerScale = useMotionValue(1);
  const containerX = useMotionValue('0vw');
  const containerY = useMotionValue('0vh');
  const macbookOpacity = useMotionValue(0);

  // 🌟 iMac 
  const imacX = useMotionValue('-100vw'); 
  const imacY = useMotionValue('-50%'); 
  const imacOpacity = useMotionValue(0);

  // 🌟 Mac Studio
  const macStudioX = useMotionValue('-100vw'); 
  const macStudioY = useMotionValue('-50%'); 
  const macStudioOpacity = useMotionValue(0);

  // 🌟 文字扫光
  const syncTextOpacity = useMotionValue(0);
  const syncTextBlur = useMotionValue(20);
  const syncTextX = useMotionValue('40vw'); 
  const syncTextY = useMotionValue('-50%'); 
  const syncTextBlurString = useTransform(syncTextBlur, (v) => `blur(${v}px)`);

  // 🌟 扫光逻辑：暗白(未扫过) -> 蓝光(正在扫) -> 纯白(扫过之后永远保留)
  const sweepPercent = useMotionValue(-20);
  const stop1 = useTransform(sweepPercent, v => `${v - 20}%`); 
  const stop2 = useTransform(sweepPercent, v => `${v - 10}%`);  
  const stop3 = useTransform(sweepPercent, v => `${v}%`);      
  const stop4 = useTransform(sweepPercent, v => `${v + 15}%`); 
  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #0016d8 ${stop2}, #0016d8 ${stop3}, rgba(255,255,255,0.15) ${stop4})`;

  useEffect(() => {
    if (!videoEnded) return;

    const timer1 = setTimeout(() => {
      setShowBarContent(true);

      const timer2 = setTimeout(() => {
        setShowHistory(true);

        const timer3 = setTimeout(() => {
          setIsRippling(true);
          setIsGlowActive(true);

          animate(rippleScale, [0, 35, 0], { duration: 0.8, ease: "easeInOut" });
          animate(noiseOffsetY, [0, -1200], { duration: 0.8, ease: "linear" });
          animate(containerScale, [1, 1.04, 1], { duration: 0.8, ease: "easeInOut" });

          setTimeout(() => {
            setIsRippling(false);
          }, 800);

           const timer4 = setTimeout(() => {
             setFadeOutAll(true);
           }, 5500);

           // 阶段 5: 全家桶排版集结
           const timer5 = setTimeout(() => {
              const dynamicNonLinearEasing = [0.85, 0, 0.15, 1];
              const animDuration = 1.2; 

              // 1. MacBook (位置保持你认为正确的状态)
              animate(containerScale, 0.252, { duration: animDuration, ease: dynamicNonLinearEasing });
              animate(containerX, '-14vw', { duration: animDuration, ease: dynamicNonLinearEasing });
              animate(containerY, '12vh', { duration: animDuration, ease: dynamicNonLinearEasing }); 
              animate(macbookOpacity, 1, { duration: animDuration, ease: dynamicNonLinearEasing });

              // 2. iMac - 🌟 大幅下移以对齐 Mac Studio 底边 (从 16.5vh 增加到 28vh)
              animate(imacX, '-32vw', { duration: animDuration, ease: dynamicNonLinearEasing });
              animate(imacY, 'calc(-50% + 22vh - 12vw)', { duration: animDuration, ease: dynamicNonLinearEasing }); 
              animate(imacOpacity, 1, { duration: animDuration, ease: dynamicNonLinearEasing });

              // 3. Mac Studio (位置保持你认为正确的状态)
              animate(macStudioX, '-2vw', { duration: animDuration, ease: dynamicNonLinearEasing }); 
              animate(macStudioY, 'calc(-50% + 22vh)', { duration: animDuration, ease: dynamicNonLinearEasing }); 
              animate(macStudioOpacity, 1, { duration: animDuration, ease: dynamicNonLinearEasing });

              // 4. 文字动画
              setTimeout(() => {
                animate(syncTextOpacity, 1, { duration: 0.8, ease: "easeOut" });
                animate(syncTextBlur, 0, { duration: 0.8, ease: "easeOut" });
                
                animate(syncTextX, '32vw', { duration: 0.8, ease: "easeOut" }); 
                animate(syncTextY, 'calc(-50% + 4vh)', { duration: 0.8, ease: "easeOut" }); 
                
                animate(sweepPercent, 130, { duration: 2.2, ease: "easeInOut" });
              }, 600);

           }, 7000);

           return () => {
             clearTimeout(timer4);
             clearTimeout(timer5);
           };
        }, 2000);

        return () => clearTimeout(timer3);
      }, 4150);

      return () => clearTimeout(timer2);
    }, 3700);

    return () => clearTimeout(timer1);
  }, [videoEnded, rippleScale, noiseOffsetY, containerScale, macbookOpacity, imacX, imacOpacity, macStudioX, macStudioOpacity, syncTextOpacity, syncTextBlur, syncTextX, sweepPercent]); 
  
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", () => {
    if (!sectionRef.current || videoPlaying || videoEnded) return;
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.25) {
      setVideoPlaying(true);
      videoRef.current?.play();
    }
  });

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
          src={iMacImg} 
          alt="iMac" 
          className="apple-imac-layer"
          style={{ x: imacX, y: imacY, opacity: imacOpacity }}
        />

        <motion.div 
          className="video-tight-wrapper"
          style={{ 
            filter: isRippling ? 'url(#water-ripple)' : 'none',
            scale: containerScale,
            x: containerX,
            y: containerY,
            z: 0,
            willChange: isRippling ? 'filter, transform' : 'auto'
          }}
        >
          <video ref={videoRef} src={Video2} className="programming-scroll-video" preload="auto" muted playsInline onEnded={() => setVideoEnded(true)} />

          <div className={`video-glow-overlay ${isGlowActive ? 'glow-active' : ''} ${fadeOutAll ? 'fade-out-all' : ''}`}>
            <div className="glow-system">
              <div className="glow-color glow-color-1"></div>
              <div className="glow-color glow-color-2"></div>
              <div className="glow-black-hole"></div>
            </div>
          </div>

          {showBarContent && (
            <div className={`bar-content-wrapper ${showHistory ? 'bar-exit' : ''}`}>
              <div className="bar-title-wrapper">
                <p className="bar-title">AI-Sorted Clipboard History</p>
              </div>
              <div className="bar-image-wrapper">
                <img src={Bar} alt="Bar" className="bar-image" />
              </div>
            </div>
          )}

          {showHistory && (
            <div className={`history-layout-container ${fadeOutAll ? 'fade-out-all' : ''}`}>
              <div className="history-left-side">
                <img src={HistoryImg} alt="History Window" className="history-window-image" />
              </div>
              <div className="history-right-side">
                <p className="powered-by-text">Powered by<br/>AI</p>
              </div>
            </div>
          )}

          <motion.img 
            src={Macbook} 
            alt="Macbook Overlay" 
            className="macbook-overlay-image" 
            style={{ opacity: macbookOpacity }} 
          />
        </motion.div>

        <motion.img 
          src={MacstudioImg} 
          alt="Mac Studio" 
          className="apple-macstudio-layer"
          style={{ x: macStudioX, y: macStudioY, opacity: macStudioOpacity }}
        />

        <motion.div 
          className="sync-text-container"
          style={{ 
            opacity: syncTextOpacity, 
            x: syncTextX, 
            y: syncTextY,
            filter: syncTextBlurString 
          }}
        >
          <motion.h2 style={{ backgroundImage: animatedGradient }}>
            Seamlessly<br/>sync across<br/>your Macs
          </motion.h2>
        </motion.div>
      </div>
      
      {videoEnded && (
        <div className={`clipo-interface-wrapper ${showBarContent ? 'clipo-exit' : ''} ${fadeOutAll ? 'fade-out-all' : ''}`}>
          <div className="clipo-text-group">
            <p className="clipo-text-top">Vibe-Coding Works</p>
            <p className="clipo-text-bottom">Clipo</p>
          </div>
          <img src={ClipoInterface} alt="Clipo Interface" className="clipo-interface-image" />
        </div>
      )}
    </section>
  );
}