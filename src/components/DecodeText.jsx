import React, { useState, useEffect, useRef } from 'react';

export default function DecodeText({ text, className = "" }) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [renderedElements, setRenderedElements] = useState([]);
  const intervalRef = useRef(null);

  const startDecodeAnimation = () => {
    let iteration = 0;
    const lag = 5; // 乱码拖尾长度

    // 清除上一次可能存在的动画
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const newElements = [];

      for (let i = 0; i < text.length; i++) {
        // 1. 还没轮到这个字符，隐藏但保留物理占位，防止宽度抖动
        if (iteration < i) {
          newElements.push(
            <span key={i} style={{ visibility: "hidden" }}>
              {text[i]}
            </span>
          );
        } 
        // 2. 锁定真实字符
        else if (iteration >= i + lag) {
          newElements.push(<span key={i}>{text[i]}</span>);
        } 
        // 3. 过渡期乱码
        else {
          if (text[i] === ' ') {
            newElements.push(<span key={i}> </span>);
          } else {
            newElements.push(
              <span key={i}>
                {letters[Math.floor(Math.random() * letters.length)]}
              </span>
            );
          }
        }
      }

      setRenderedElements(newElements);

      if (iteration >= text.length + lag) {
        clearInterval(intervalRef.current);
      }

      iteration += 0.4; // 控制解码速度
    }, 30); // 控制帧率
  };

  useEffect(() => {
    // 组件挂载时自动播放一次
    startDecodeAnimation();

    // 组件卸载时清理定时器，防止内存泄漏
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text]); // 如果传入的 text 发生变化，重新播放动画

  return (
    <div 
      className={`decode-text-container ${className}`} 
      onMouseEnter={startDecodeAnimation} // 鼠标悬停时再次播放
      style={{
        fontFamily: "'Courier New', Consolas, Monaco, monospace", // 强制等宽字体防止抖动
        whiteSpace: "pre", 
        cursor: "default",
        display: "inline-block" // 让容器紧贴文字
      }}
    >
      {/* 初始渲染或动画未开始前，先放一个隐藏的占位，撑开高度 */}
      {renderedElements.length > 0 ? renderedElements : <span style={{visibility: 'hidden'}}>{text}</span>}
    </div>
  );
}