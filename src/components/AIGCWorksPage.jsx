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
        
        // 🌟 核心修改点：将动画结束锚点从 800 改为 600
        // 这样动画结束的那一刻，正好是 GeneratedContent 完全盖住屏幕的那一刻。
        // 反之，当从 GeneratedContent 往上滑（露出 AIGC）的瞬间，动画就会立刻开始无缝倒放！
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

  // 利用进度驱动 CSS 属性
  const ringTop = useTransform(smoothProgress, [0, 1], ["230%", "50%"]);
  const ringWidth = useTransform(smoothProgress, [0, 1], ["210vw", "300vw"]);

  return (
    <section id="aigc" className="aigc-portfolio-section" ref={sectionRef}>
      {/* 原生粘性容器：取代锁定机制 */}
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
            top: ringTop,
            width: ringWidth
          }}
        />
      </div>
    </section>
  );
}