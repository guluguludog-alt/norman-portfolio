import { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import DecryptedText from './DecryptedText';
import './aigcWorksPage.css';

import videoFile from '../assets/Video1.mp4';
import ringImg from '../assets/Ring.png';

export default function AIGCWorksPage() {
  const sectionRef = useRef(null);

  // 记录该 Section 的滚动阈值参数
  const [scrollMetrics, setScrollMetrics] = useState({ start: 0, end: 1000 });

  useLayoutEffect(() => {
    const updateMetrics = () => {
      if (sectionRef.current) {
        const vh = window.innerHeight;
        const top = sectionRef.current.offsetTop;
        
        // 动画结束的那一刻，正好是 GeneratedContent 完全盖住屏幕的那一刻。
        const animEnd = top + (4 * vh - 600);
        
        setScrollMetrics({ start: top, end: animEnd });
      }
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, []);

  // 将原生滚动直接映射到我们的阈值内
  const { scrollY } = useScroll();
  const ringProgress = useTransform(scrollY, [scrollMetrics.start, scrollMetrics.end], [0, 1]);
  const smoothProgress = useSpring(ringProgress, { stiffness: 100, damping: 30 });

  // 🌟 核心性能优化：废弃 top 和 width，改用纯 GPU 加速的 y 和 scale
  // 数学转换：原本 width 从 210vw -> 300vw，等价于基础 100vw 配合 scale 2.1 -> 3.0
  const scale = useTransform(smoothProgress, [0, 1], [2.1, 3.0]);
  
  // 数学转换：原本 top 从 230vh -> 50vh，等价于基础 top 50%，y 轴额外向下偏移 180vh -> 0vh
  // 注意：必须保留 -50% 的自身居中偏移量，以替代 CSS 中的 translate(-50%, -50%)
  const y = useTransform(smoothProgress, [0, 1], ["calc(-50% + 180vh)", "calc(-50% + 0vh)"]);

  return (
    <section id="aigc" className="aigc-portfolio-section" ref={sectionRef}>
      <div className="aigc-sticky-container">
        <div className="aigc-video-container">
          <video
            src={videoFile}
            className="aigc-scroll-video"
            preload="auto"
            muted
            playsInline
            autoPlay
            loop
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
            width: "100vw", // 基础宽度定死
            x: "-50%",      // 水平居中偏移
            y: y,           // GPU 垂直位移
            scale: scale,   // GPU 缩放
            z: 0,           // 🌟 强制开启 Framer Motion 的独立硬件加速层
            willChange: "transform"
          }}
        />
      </div>
    </section>
  );
}