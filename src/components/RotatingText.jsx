import React, { useState, useEffect } from 'react';
// 确保这里引入了我们在第二步创建的文件
import DecryptedText from './DecryptedText';

export default function RotatingText() {
  // 这里存放你要循环播放的词汇
  const words = ['Architectural', 'Landscape', 'AIGC'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 设定定时器：每隔 2500 毫秒（2.5秒）自动切换到下一个词
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2500);

    // 组件卸载时清理定时器
    return () => clearInterval(interval);
  }, []);

  return (
    // 加一个固定宽度，防止文字长短不一导致页面排版左右跳动
    <span style={{ display: 'inline-block', minWidth: '220px', textAlign: 'center' }}>
      <DecryptedText
        key={currentIndex} // 核心：每次 currentIndex 改变，强制重新播放进场动画
        text={words[currentIndex]}
        parentClassName="keep-my-font"
        animateOn="view"
        speed={60}
        maxIterations={12}
        sequential={true}
        revealDirection="start"
        useOriginalCharsOnly={false}
      />
    </span>
  );
}