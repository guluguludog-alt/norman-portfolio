import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import './mySpacePage.css';

const TOTAL_FRAMES = 156; 

export default function MySpacePage() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. 预加载图片 ---
  useEffect(() => {
    const loadedImages = [];
    let loadCount = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/myspace_frames/frame_${String(i).padStart(4, '0')}.jpg`;
      img.onload = () => {
        loadCount++;
        if (loadCount === TOTAL_FRAMES) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // --- 2. Canvas 绘制 ---
  const drawFrame = (index) => {
    if (!canvasRef.current || !images[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (isLoaded) drawFrame(0);
  }, [isLoaded]);

  // --- 3. 核心修复：使用 Framer Motion 实时物理追踪 ---
  // 这会利用 ResizeObserver 实时追踪元素，彻底解决上方 DOM 高度变化导致的定位偏移
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // 映射逻辑：
    // ["动画开始时机", "动画结束时机"]
    // start center -> 容器顶部碰到视口中心 (即出现二分之一)
    // 25% start -> 容器的 25% 高度碰到视口顶部 (即滑出了 1/4，页面还剩四分之三)
    offset: ["start center", "25% start"] 
  });

  // --- 4. 监听进度 (0 ~ 1) ---
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isLoaded) return;
    // scrollYProgress 自动被严格限制在 0 ~ 1 之间
    const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
    requestAnimationFrame(() => drawFrame(frameIndex));
  });

  return (
    <section id="myspace" className="my-space-page-container" ref={sectionRef}>
      <canvas ref={canvasRef} className="myspace-sequence-canvas" />
    </section>
  );
}