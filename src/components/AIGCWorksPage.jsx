import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLenis } from 'lenis/react';
import DecryptedText from './DecryptedText';
import './aigcWorksPage.css';

import videoFile from '../assets/Video1.mp4';
import ringImg from '../assets/Ring.png';

export default function AIGCWorksPage() {
  const sectionRef = useRef(null);
  
  // 动画进度驱动 (0 = 初始, 1 = 过渡完成)
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });
  const lenisRef = useRef(null);
  
  // ================= 核心状态控制 =================
  const isLocked = useRef(false);       // 当前是否处于“动画锁定”状态
  const hasCompleted = useRef(false);   // 是否已经完成了过渡并进入了下一页
  const isEscapingUp = useRef(false);   // 【新增】是否正在向反方向退出 (用于防止解锁后瞬间重锁)
  const virtualScroll = useRef(0);      // 模拟滚动的位移记录
  const pendingScroll = useRef(false);  // ring 动画结束后才跳转

  const [ringStyle, setRingStyle] = useState({
    top: '230%',
    width: '210vw',
  });

  // 1. 监听进度变化，驱动 UI 动画（Ring 的缩放和位置）
  //    并等待 spring 动画真正结束后再跳转
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      const topPercent = 230 - v * 180; // 230% -> 50%
      const widthVw = 210 + v * 90;     // 210vw -> 300vw
      setRingStyle({
        top: `${topPercent}%`,
        width: `${widthVw}vw`,
      });

      // ring spring 动画到位后再跳转到 GeneratedContent
      if (v >= 0.995 && pendingScroll.current) {
        pendingScroll.current = false;
        if (lenisRef.current) {
          lenisRef.current.start();
          const target = document.querySelector('#generated-content');
          if (target) {
            lenisRef.current.scrollTo(target, { offset: 0, immediate: true });
          }
        }
        setTimeout(() => progress.set(0), 500);
      }
    });
    return unsubscribe;
  }, [smoothProgress, progress]);

  // 2. 虚拟滚动处理函数：在页面锁定时接管用户的滑动意图
  const updateVirtualScroll = useCallback((deltaY) => {
    // 设定滑动多少像素完成整个动画 (1.5倍屏幕高度)
    const scrollRange = window.innerHeight * 1.5;
    virtualScroll.current += deltaY;
    
    const raw = virtualScroll.current / scrollRange;
    const clampedProgress = Math.max(0, Math.min(1, raw));
    
    progress.set(clampedProgress);

    // --- 情况 A: 动画到达终点 ---
    if (raw >= 1) {
      isLocked.current = false;
      hasCompleted.current = true; 
      virtualScroll.current = 0;
      pendingScroll.current = true;  // 等待 ring spring 动画到位后再跳转
    } 
    // --- 情况 B: 动画退回起点 (用户取消过渡) ---
    else if (raw <= 0) {
      isLocked.current = false;
      virtualScroll.current = 0;
      progress.set(0);
      
      // 【关键修复】打上“正在向后撤退”的标记
      isEscapingUp.current = true; 
      
      if (lenisRef.current) {
        lenisRef.current.start(); // 恢复原生滚动，现在可以向上划出了
      }
    }
  }, [progress]);

  // 3. 拦截物理滚动事件 (只有在 isLocked 为 true 时才接管)
  useEffect(() => {
    const handleWheel = (e) => {
      if (isLocked.current) {
        e.preventDefault();
        e.stopPropagation();
        updateVirtualScroll(e.deltaY);
      } else if (e.deltaY > 0) {
        // 【关键修复】如果用户没有被锁定，并且主动往下滚，立刻清除“撤退”标记，允许重锁
        isEscapingUp.current = false;
      }
    };

    // 移动端支持
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      if (isLocked.current) {
        e.preventDefault();
        e.stopPropagation();
        touchStartY = e.touches[0].clientY; // 锁定时的连续追踪
        updateVirtualScroll(deltaY);
      } else if (deltaY > 0) {
        // 【关键修复】移动端主动向下滑动，清除撤退标记
        isEscapingUp.current = false;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [updateVirtualScroll]);

  // 4. Lenis 滚动生命周期监控
  useLenis((lenis) => {
    lenisRef.current = lenis;
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();

    // 逻辑 A: 重置机制
    // 当用户完全滑回上方（Landscape 区域）时，重置全部标记，随时准备迎接下次触发
    if (rect.top > 100) {
      hasCompleted.current = false;
      isEscapingUp.current = false;
    }

    // 逻辑 B: 锁定机制 (仅限 AIGC 向下过渡)
    // 只有在：页面到顶了 + 没被锁定 + 没过渡完成 + 【并且用户没有在向后撤退】时，才触发锁定
    if (
      rect.top <= 0 && 
      !isLocked.current && 
      !hasCompleted.current && 
      !isEscapingUp.current 
    ) {
      isLocked.current = true;
      virtualScroll.current = 0;
      progress.set(0);
      
      // 停止 Lenis 原生滚动，强行吸附到当前 Section
      lenis.scrollTo(sectionRef.current, { offset: 0, immediate: true });
      lenis.stop();
    }
  });

  return (
    <section
      id="aigc"
      className="aigc-portfolio-section"
      ref={sectionRef}
    >
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
        style={ringStyle}
      />
    </section>
  );
}