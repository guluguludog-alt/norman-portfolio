import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import './experiencePage.css';
import Aurora from './AuroraEffect'; 

export default function ExperiencePage() {
  const targetRef = useRef(null);

  // 侦测页面滚动情况
  // start end: ExperiencePage 顶部刚进入屏幕底端（开始出现）
  // start start: ExperiencePage 顶部刚到达屏幕顶端（准备开始消失）
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "start start"]
  });

  // 将滚动进度 (0 到 1) 映射为光效划过的百分比 (-20% 到 120% 确保完全移出边界)
  const percent = useTransform(scrollYProgress, [0, 1], [-20, 120]);
  
  // 计算渐变色的 4 个关键锚点
  const stop1 = useTransform(percent, v => `${v - 15}%`); // 纯白色的终点
  const stop2 = useTransform(percent, v => `${v - 5}%`);  // 亮蓝光晕开始
  const stop3 = useTransform(percent, v => `${v}%`);      // 深蓝光核心
  const stop4 = useTransform(percent, v => `${v + 10}%`); // 消散为透明

  // 利用模板字符串生成动态的线性渐变背景
  // 透明边缘使用 rgba(0, 22, 216, 0) 防治某些浏览器下出现灰色带
  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #8599d2 ${stop2}, #0016d8 ${stop3}, rgba(0, 22, 216, 0) ${stop4})`;

  return (
    <section id="experience" className="experience-page" ref={targetRef}>
      
      {/* 顶部镜像极光 (融为一体的倒影效果) */}
      <div className="experience-aurora-top">
        <Aurora
          colorStops={["#8599d2","#0016d8","#5211dd"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* 文字容器 (靠下位置) */}
      <div className="exp-text-container">
        <motion.h1 
          className="exp-text"
          style={{ backgroundImage: animatedGradient }}
        >
          Experiences
        </motion.h1>
      </div>

    </section>
  );
}