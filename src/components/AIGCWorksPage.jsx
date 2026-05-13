import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import DecryptedText from './DecryptedText';
import './aigcWorksPage.css';

// 🌟 1. 引入经过 FFmpeg 优化后的视频文件
import videoFile from '../assets/Video1_web.mp4';
import ringImg from '../assets/Ring.png';

export default function AIGCWorksPage() {
  const sectionRef = useRef(null);
  const [scrollMetrics, setScrollMetrics] = useState({ start: 0, end: 1000 });

  useLayoutEffect(() => {
    const updateMetrics = () => {
      if (sectionRef.current) {
        const vh = window.innerHeight;
        const top = sectionRef.current.offsetTop;
        const animEnd = top + (4 * vh - 600);
        setScrollMetrics({ start: top, end: animEnd });
      }
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, []);

  const { scrollY } = useScroll();
  const ringProgress = useTransform(scrollY, [scrollMetrics.start, scrollMetrics.end], [0, 1]);
  const smoothProgress = useSpring(ringProgress, { stiffness: 100, damping: 30 });

  const scale = useTransform(smoothProgress, [0, 1], [2.1, 3.0]);
  const y = useTransform(smoothProgress, [0, 1], ["calc(-50% + 180vh)", "calc(-50% + 0vh)"]);

  return (
    <section id="aigc" className="aigc-portfolio-section" ref={sectionRef}>
      <div className="aigc-sticky-container">
        <div className="aigc-video-container">
          {/* 🌟 2. 极致优化的 video 标签 */}
          <video
            src={videoFile}
            className="aigc-scroll-video"
            preload="metadata" /* 将 auto 改为 metadata 释放内存 */
            muted
            playsInline
            autoPlay
            loop
            style={{ 
              willChange: 'transform', 
              transform: 'translateZ(0)' /* 强制 GPU 硬件加速 */
            }} 
          />
        </div>
        <div className="aigc-titles">
          <DecryptedText
            text="AIGC"
            animateOn="view"
            threshold={0.5}
            speed={50}
            maxIterations={30}
            revealDirection="center"
            className="aigc-title-char"
            parentClassName="aigc-main-wrapper"
          />
          <DecryptedText
            text="Works"
            animateOn="view"
            threshold={0.5}
            speed={50}
            maxIterations={30}
            revealDirection="center"
            className="aigc-title-char"
            parentClassName="aigc-sub-wrapper"
          />
        </div>
        
        <motion.img
          src={ringImg}
          alt="Ring"
          className="aigc-ring"
          style={{
            top: "50%",
            left: "50%",
            width: "100vw", 
            x: "-50%",      
            y: y,           
            scale: scale,   
            z: 0,           
            willChange: "transform"
          }}
        />
      </div>
    </section>
  );
}