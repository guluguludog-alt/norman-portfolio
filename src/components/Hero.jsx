import React, { useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion'; // 🌟 引入滚动监听
import RotatingText from "./RotatingText";
import DecryptedText from "./DecryptedText";

export default function Hero({ isAppLoaded }) {
  const [offset, setOffset] = useState({ x: 40, y: -30 });
  const [opacity, setOpacity] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false); // 🌟 记录是否已经滑过首屏

  const { scrollY } = useScroll();

  // 🌟 性能优化：当向下滑动超过一个屏幕高度时，标记为滑过
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > window.innerHeight) {
      if (!isScrolledPast) setIsScrolledPast(true);
    } else {
      if (isScrolledPast) setIsScrolledPast(false);
    }
  });

  useEffect(() => {
    if (isAppLoaded) {
      setOffset({ x: 0, y: 0 });
      setOpacity(1);
    }
  }, [isAppLoaded]);

  return (
    <section 
      id="home" 
      className="section"
      // 🌟 核心：滑过之后设置为 hidden，告诉浏览器彻底停止计算被遮挡的 CSS 动画（如背景层的闪烁和提示箭头的 bounce）
      style={{ visibility: isScrolledPast ? 'hidden' : 'visible' }}
    >
      <div className="bg-container">
        <img 
          src="/background_layer.png" 
          alt="bg base" 
          className="bg-layer bg-layer-1"
          style={{ 
            transform: `translate(${-offset.x}px, ${-offset.y}px)`,
            opacity: opacity,
            transition: 'transform 2s ease, opacity 2s ease'
          }}
        />
        <img 
          src="/pixel_layer.png" 
          alt="bg overlay" 
          className="bg-layer bg-layer-2"
          style={{ 
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            opacity: opacity,
            transition: 'transform 2s ease, opacity 2s ease'
          }}
        />
        <img 
          src="/background_layer.png" 
          alt="bg fade in" 
          className="bg-layer bg-layer-3"
          style={{ 
            opacity: opacity,
            transition: 'opacity 2s ease'
          }}
        />
      </div>
      
      <div className="title-main">
        {isAppLoaded && (
          <h1>
            {/* 🌟 核心：把暂停信号传给循环文字组件 */}
            <RotatingText isPaused={isScrolledPast} /><br />{" "}
            <DecryptedText 
              text="Designer" 
              parentClassName="keep-my-font"
              animateOn="view" 
              speed={120} 
              maxIterations={15} 
              revealDirection="start" 
              sequential={true} 
              useOriginalCharsOnly={false} 
            />
          </h1>
        )}
      </div>
      
      <div className="title-name">
        {isAppLoaded && (
          <h2>{" "}
             <DecryptedText 
                text="Norman Liu" 
                parentClassName="keep-my-font-name"
                animateOn="view" 
                speed={100} 
                maxIterations={15} 
                revealDirection="start" 
                sequential={true} 
                useOriginalCharsOnly={false} 
              />
          </h2>
        )}
      </div>

      <div className="scroll-indicator" onClick={() => document.getElementById('introduction').scrollIntoView()}>
        Scroll
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}