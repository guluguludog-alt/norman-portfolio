import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useLenis } from 'lenis/react';
import './programming.css';

// 引入视频资源
import Video2 from '../assets/Video2.mp4';

export default function Programming() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  
  const lenis = useLenis();
  const { scrollY } = useScroll();

  // 🌟 1. 监听滚动进度：当页面露出 3/4 时开始播放
  useMotionValueEvent(scrollY, "change", () => {
    if (!sectionRef.current || videoPlaying || videoEnded) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    // window.innerHeight * 0.25 意味着该容器顶部距离屏幕顶部只有 25% 的距离
    // 等同于该页面已经从下方露出了 75% (四分之三)
    if (rect.top <= window.innerHeight * 0.25) {
      setVideoPlaying(true);
      videoRef.current?.play();
    }
  });

  // 🌟 2. 强制锁屏拦截：直到视频结束前，禁止滚到下一页
  useEffect(() => {
    if (!lenis) return;
    
    const onScroll = ({ scroll }) => {
      // 如果还没滑到该区块，或者视频已经播完了，直接放行
      if (!sectionRef.current || videoEnded) return;
      
      const targetScroll = sectionRef.current.offsetTop;
      
      // 当用户试图向下滚动，越过这个页面时（+1 是为了防止浮点数计算误差导致抖动）
      if (scroll > targetScroll + 1) {
        // 强制把页面死死拉回当前页面的顶部
        lenis.scrollTo(targetScroll, { immediate: true });
      }
    };

    // 绑定 Lenis 的原生滚动监听
    lenis.on('scroll', onScroll);
    return () => lenis.off('scroll', onScroll);
  }, [lenis, videoEnded]);

  return (
    <section id="programming" className="programming-page" ref={sectionRef}>
      <div className="programming-video-container">
        <video
          ref={videoRef}
          src={Video2}
          className="programming-scroll-video"
          preload="auto"
          muted
          playsInline
          // 当视频播放结束时，更新状态解除滚动的强制锁定
          onEnded={() => setVideoEnded(true)}
        />
      </div>
    </section>
  );
}