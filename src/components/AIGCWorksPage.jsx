import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import DecryptedText from './DecryptedText';
import './aigcWorksPage.css';

import videoFile from '../assets/Video1_web.mp4';
import ringImg from '../assets/Ring.png';

export default function AIGCWorksPage() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null); 
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth <= 900 : false);
  const [isMobile, setIsMobile] = useState(isMobileRef.current);
  
  const isInView = useInView(sectionRef, { margin: "0px 0px -200px 0px" });

  const [scrollMetrics, setScrollMetrics] = useState({ start: 0, end: 1000 });

  useLayoutEffect(() => {
    if (isMobileRef.current) return; 
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

  const scale = useTransform(ringProgress, [0, 1], [2.1, 3.0]);
  const y = useTransform(ringProgress, [0, 1], ["calc(-50% + 180vh)", "calc(-50% + 0vh)"]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      if (mobile !== isMobileRef.current) {
        isMobileRef.current = mobile;
        setIsMobile(mobile);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(e => console.log("视频播放等待交互", e));
      } else {
        videoRef.current.pause(); 
      }
    }
  }, [isInView]);

  return (
    <section id="aigc" className="aigc-portfolio-section" ref={sectionRef}>
      <div className="aigc-sticky-container">
        <div className="aigc-video-container">
          <video
            ref={videoRef}
            src={videoFile}
            className="aigc-scroll-video"
            preload="auto" /* 🌟 核心：改为 auto 强行后台预缓存视频流，抹杀滑入黑屏闪烁 */
            muted
            playsInline
            loop
            style={{ 
              willChange: 'transform', 
              transform: 'translateZ(0)' 
            }} 
          />
        </div>
        <div className="aigc-titles">
          <DecryptedText
            text="AIGC" animateOn="view" threshold={0.5} speed={50} maxIterations={30}
            revealDirection="center" className="aigc-title-char" parentClassName="aigc-main-wrapper"
          />
          <DecryptedText
            text="Works" animateOn="view" threshold={0.5} speed={50} maxIterations={30}
            revealDirection="center" className="aigc-title-char" parentClassName="aigc-sub-wrapper"
          />
        </div>
        
        {!isMobile && (
          <motion.img
            src={ringImg}
            alt="Ring"
            className="aigc-ring"
            style={{ top: "50%", left: "50%", width: "100vw", x: "-50%", y: y, scale: scale, z: 0, willChange: "transform" }}
          />
        )}
      </div>
    </section>
  );
}