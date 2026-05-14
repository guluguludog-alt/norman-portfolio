import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import './mySpacePage.css';

const TOTAL_FRAMES = 156; 

export default function MySpacePage() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const lastDrawnIndex = useRef(-1);
  const rafId = useRef(null);

  useEffect(() => {
    const loadedImages = [];
    let loadCount = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/myspace_frames/frame_${String(i).padStart(4, '0')}.jpg`;
      img.decoding = "async";
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

  const drawFrame = (index) => {
    if (!canvasRef.current || !images[index]) return;
    // 🌟 性能突破点：直接获取上下文绘制，坚决不在这一步给 canvas.width 和 canvas.height 赋值，防止销毁缓冲区！
    const ctx = canvasRef.current.getContext('2d', { alpha: false }); 
    ctx.drawImage(images[index], 0, 0, 1920, 1080);
  };

  useEffect(() => {
    if (isLoaded) {
      drawFrame(0);
      lastDrawnIndex.current = 0;
    }
  }, [isLoaded]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "25% start"] 
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!isLoaded) return;
    
    const frameIndex = Math.floor(progress * (TOTAL_FRAMES - 1));
    
    if (frameIndex === lastDrawnIndex.current) return;
    lastDrawnIndex.current = frameIndex;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => drawFrame(frameIndex));
  });

  return (
    <section id="myspace" className="my-space-page-container" ref={sectionRef}>
      {/* 🌟 在渲染时直接定死 Canvas 内部分辨率 */}
      <canvas ref={canvasRef} width="1920" height="1080" className="myspace-sequence-canvas" />
    </section>
  );
}