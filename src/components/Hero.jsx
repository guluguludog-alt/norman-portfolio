import React, { useState, useEffect } from 'react';
import RotatingText from "./RotatingText";
import DecryptedText from "./DecryptedText";

// 🌟 接收来自 App 传来的 isAppLoaded 状态
export default function Hero({ isAppLoaded }) {
  const [offset, setOffset] = useState({ x: 40, y: -30 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // 🌟 当且仅当加载页滑走时，才触发背景和文字的进场动画
    if (isAppLoaded) {
      setOffset({ x: 0, y: 0 });
      setOpacity(1);
    }
  }, [isAppLoaded]);

  return (
    <section id="home" className="section">
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
        {/* 🌟 用 isAppLoaded 锁住文字组件，阻止乱码组件提前进入视口并强行播放 */}
        {isAppLoaded && (
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