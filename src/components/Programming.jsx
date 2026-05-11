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

  // 视频结束 + 初始动画播完后 2s，触发 bar 内容进场
  useEffect(() => {
    if (!videoEnded) return;
    const timer = setTimeout(() => setShowBarContent(true), 2000);
    return () => clearTimeout(timer);
  }, [videoEnded]);
  
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
      
      {/* ClipoInterface 图片 + 上方文字：视频播放完成后居中显示，带放大+渐入动画 */}
      {videoEnded && (
        <div className={`clipo-interface-wrapper ${showBarContent ? 'clipo-exit' : ''}`}>
          <div className="clipo-text-group">
            <p className="clipo-text-top">Vibe-Coding Works</p>
            <p className="clipo-text-bottom">Clipo</p>
          </div>
          <img
            src={ClipoInterface}
            alt="Clipo Interface"
            className="clipo-interface-image"
          />
        </div>
      )}

      {/* AI-Sorted Clipboard History 标题：页面偏上居中，从左侧移入 */}
      {showBarContent && (
        <p className="bar-title">AI-Sorted Clipboard History</p>
      )}

      {/* Bar 图片：页面下方居中，从左侧移入 */}
      {showBarContent && (
        <div className="bar-image-wrapper">
          <img
            src={Bar}
            alt="Bar"
            className="bar-image"
          />
        </div>
      )}
    </section>
  );
}