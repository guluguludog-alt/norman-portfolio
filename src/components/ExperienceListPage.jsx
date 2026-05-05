import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import './experienceListPage.css';
import starBg from '../assets/Starbackground.png'; 

const CompanyItem = React.memo(({ company, index, scrollYProgress }) => {
  
  const opacityStart = index * 0.12; 
  const opacityEnd = opacityStart + 0.15; 
  const itemOpacity = useTransform(scrollYProgress, [opacityStart, opacityEnd], [0, 1]);

  const sweepStart = opacityStart + 0.1; 
  const sweepEnd = sweepStart + 0.4; 
  const percent = useTransform(scrollYProgress, [sweepStart, sweepEnd], [-20, 120]);

  const stop1 = useTransform(percent, v => `${v - 15}%`); 
  const stop2 = useTransform(percent, v => `${v - 5}%`);  
  const stop3 = useTransform(percent, v => `${v}%`);      
  const stop4 = useTransform(percent, v => `${v + 10}%`); 

  const animatedGradient = useMotionTemplate`linear-gradient(to right, #ffffff ${stop1}, #8599d2 ${stop2}, #0016d8 ${stop3}, rgba(255, 255, 255, 0.25) ${stop4})`;

  return (
    <motion.div 
      className="company-item"
      style={{ opacity: itemOpacity }} 
    >
      <motion.div 
        className="company-text-mask"
        style={{ backgroundImage: animatedGradient }} 
      >
        {company.name}
      </motion.div>
    </motion.div>
  );
});

export default function ExperienceListPage() {
  const containerRef = useRef(null);

  // 🌟 进度条 1 (文字专用)
  const { scrollYProgress: textScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  // 🌟 进度条 2 (背景专用，让星空在页面划出时依然保持滑动)
  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(bgScrollProgress, [0, 1], ["-10%", "10%"]);

  const companies = [
    { name: "Architectural Design and Research Institute of Xi'an University of Architecture and Technology", detail: "1" },
    { name: "Beijing Qinghua Tongheng Planning and Design Institute Co., Ltd. (THUPDI)", detail: "2" },
    { name: "China United Northwest Institute for Engineering Design & Research Co., Ltd.", detail: "3" },
    { name: "Diyouni Design Institute", detail: "4" },
    { name: "Zhuchuang Architectural Design Studio", detail: "5" }
  ];

  return (
    <section 
      id="experience-list" 
      className="experience-list-page"
      ref={containerRef}
    >
      <motion.div 
        className="parallax-star-bg"
        style={{ 
          y: bgY,
          backgroundImage: `url(${starBg})` 
        }}
      />

      <div className="company-list-container">
        {companies.map((company, index) => (
          <CompanyItem 
            key={index}
            index={index}
            company={company}
            scrollYProgress={textScrollProgress} 
          />
        ))}
      </div>
    </section>
  );
}