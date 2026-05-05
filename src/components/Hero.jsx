import React, { useState, useEffect } from 'react';
import RotatingText from "./RotatingText";
import DecryptedText from "./DecryptedText";

export default function Hero() {
  // 设置初始错位状态和透明度
  const [offset, setOffset] = useState({ x: 40, y: -30 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // 网页打开后立即触发背景合并动画
    setOffset({ x: 0, y: 0 });
    setOpacity(1);
  }, []);

  return (
    <section id="home" className="section">
      <div className="bg-container">
        {/* 检查点：确认 public 文件夹下文件名是 background_layer.png 还是 background_layerpng.png */}
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
        {/* 关键修正：br 加上了闭合斜杠 */}
        <h1>
          <RotatingText /><br />{" "}
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
      </div>
      
      <div className="title-name">
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
      </div>

      <div className="scroll-indicator" onClick={() => document.getElementById('introduction').scrollIntoView()}>
        Scroll
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}