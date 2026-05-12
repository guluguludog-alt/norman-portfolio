import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from 'lenis/react';
import './programming.css';

// 引入视频资源
import Video2 from '../assets/Video2.mp4';
import ClipoInterface from '../assets/ClipoInterface.png';
import Bar from '../assets/Bar.png';

export default function Programming() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showBarContent, setShowBarContent] = useState(false);

  useEffect(() => {
    if (!videoEnded) return;
    const timer = setTimeout(() => {
      setShowBarContent(true);
    }, 3700);
    return () => clearTimeout(timer);
  }, [videoEnded]);
  
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", () => {
    if (!sectionRef.current || videoPlaying || videoEnded) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.25) {
      setVideoPlaying(true);
      videoRef.current?.play();
    }
  });

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }) => {
      if (!sectionRef.current || videoEnded) return;
      const targetScroll = sectionRef.current.offsetTop;
      if (scroll > targetScroll + 1) {
        lenis.scrollTo(targetScroll, { immediate: true });
      }
    };
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis, videoEnded]);

  return (
    <section id="programming" className="programming-page" ref={sectionRef}>
      <div className="programming-video-container">

        {/* 核心包裹层：Inline-block 自然包裹，杜绝所有黑边缝隙 */}
        <div className="video-tight-wrapper">
          <video
            ref={videoRef}
            src={Video2}
            className="programming-scroll-video"
            preload="auto"
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
          />

          {/* 边缘流光遮罩 */}
          <div className={`video-glow-overlay ${showBarContent ? 'glow-active' : ''}`}>
            <div className="glow-system">
              <div className="glow-color glow-color-1"></div>
              <div className="glow-color glow-color-2"></div>
              <div className="glow-black-hole"></div>
            </div>
          </div>

          {/* AI-Sorted 标题 (三分点定位) */}
          {showBarContent && (
            <div className="bar-title-wrapper">
              <p className="bar-title">AI-Sorted Clipboard History</p>
            </div>
          )}

          {/* Bar 图片 (三分点定位) */}
          {showBarContent && (
            <div className="bar-image-wrapper">
              <img src={Bar} alt="Bar" className="bar-image" />
            </div>
          )}
        </div>

      </div>
      
      {/* 初始展示的 Clipo 文字与图片 */}
      {videoEnded && (
        <div className={`clipo-interface-wrapper ${showBarContent ? 'clipo-exit' : ''}`}>
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