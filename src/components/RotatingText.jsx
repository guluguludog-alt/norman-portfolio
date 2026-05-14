import React, { useState, useEffect } from 'react';
import DecryptedText from './DecryptedText';

// 🌟 接收 isPaused 属性
export default function RotatingText({ isPaused }) {
  const words = ['Architectural', 'Landscape', 'AIGC'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 🌟 如果被盖住了，就不要启动定时器（停止无限 React 状态更新）
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused]); // 🌟 依赖项中加入 isPaused，随时启停

  return (
    <span style={{ display: 'inline-block', minWidth: '220px', textAlign: 'center' }}>
      {/* 🌟 如果被遮挡，直接渲染静态文字，杀死内部乱码组件的 IntersectionObserver 和动画计算 */}
      {isPaused ? (
        <span className="keep-my-font">{words[currentIndex]}</span>
      ) : (
        <DecryptedText
          key={currentIndex} 
          text={words[currentIndex]}
          parentClassName="keep-my-font"
          animateOn="view"
          speed={60}
          maxIterations={12}
          sequential={true}
          revealDirection="start"
          useOriginalCharsOnly={false}
        />
      )}
    </span>
  );
}