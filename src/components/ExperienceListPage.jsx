import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import './experienceListPage.css';
import starBg from '../assets/Starbackground.png'; 

const CompanyItem = React.memo(({ company, index, scrollYProgress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  
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

  // ================= 核心动画编排 =================
  
  // 1. 原公司名：放大缓冲 + 遮罩擦除
  const originalTextVariants = {
    hidden: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
    rest: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      scale: 1, 
      transition: { 
        clipPath: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] },
        // 🌟 修复：加入 0.4 秒的平滑回退，如果在放大中途移走鼠标，它会温柔地缩回去而不是瞬间闪现
        scale: { duration: 0.4, ease: "easeOut" } 
      } 
    },
    hover: { 
      clipPath: "inset(0% 0% 0% 100%)", 
      scale: 1.05, 
      transition: { 
        scale: { duration: 0.7, ease: "easeInOut" },
        clipPath: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] } 
      } 
    }
  };

  // 2. 职位信息揭示
  const revealTextVariants = {
    hidden: { clipPath: "inset(0% 100% 0% 0%)" },
    rest: { 
      clipPath: "inset(0% 100% 0% 0%)", 
      transition: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] } 
    },
    hover: { 
      clipPath: "inset(0% 0% 0% 0%)", 
      transition: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] } 
    }
  };

  // 3. 竖直彗星光标
  const scannerVariants = {
    hidden: { opacity: 0, left: "0%" },
    rest: {
      left: "0%",
      opacity: 0, 
      boxShadow: "25px 0 30px 6px rgba(0, 130, 255, 0.9), 70px 0 80px 16px rgba(82, 17, 221, 0.8), 140px 0 130px 28px rgba(0, 22, 216, 0.5)",
      transition: {
        left: { duration: 0.85, delay: 0, ease: [0.4, 0, 0.2, 1] },
        boxShadow: { duration: 0 },
        opacity: { duration: 0.35, delay: 0.5, ease: "easeOut" }
      }
    },
    hover: {
      left: "100%",
      opacity: 1,
      boxShadow: "-25px 0 30px 6px rgba(0, 130, 255, 0.9), -70px 0 80px 16px rgba(82, 17, 221, 0.8), -140px 0 130px 28px rgba(0, 22, 216, 0.5)",
      transition: {
        left: { duration: 0.85, delay: 0.7, ease: [0.4, 0, 0.2, 1] },
        boxShadow: { duration: 0, delay: 0.7 },
        opacity: { duration: 0.15, delay: 0.7, ease: "easeIn" }
      }
    }
  };

  const handleHoverStart = () => {
    setIsHovered(true);
    setHasHovered(true);
  };

  const currentAnimationState = isHovered ? "hover" : (hasHovered ? "rest" : "hidden");

  return (
    <motion.div 
      className="company-item"
      style={{ opacity: itemOpacity }} 
      onHoverStart={handleHoverStart}
      onHoverEnd={() => setIsHovered(false)}
      initial="hidden"
      animate={currentAnimationState}
    >
      <div className="company-text-wrapper">
        
        <motion.div 
          className="company-text-mask original-text"
          style={{ backgroundImage: animatedGradient }} 
          variants={originalTextVariants}
        >
          {company.name.trim()}
        </motion.div>

        <motion.div 
          className="company-text-mask reveal-text"
          variants={revealTextVariants}
        >
          <div className="reveal-content">
            <span className="intern-position">{company.position.trim()}</span>
            {company.time && <span className="intern-time">{company.time}</span>}
          </div>
        </motion.div>

        <motion.div 
          className="comet-scanner"
          variants={scannerVariants}
        />
        
      </div>
    </motion.div>
  );
});

export default function ExperienceListPage() {
  const containerRef = useRef(null);

  const { scrollYProgress: textScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(bgScrollProgress, [0, 1], ["-10%", "10%"]);

  const companies = [
    { name: "Architectural Design and Research Institute of Xi'an University of Architecture and Technology", position: "Architecture Intern", time: "2024.9-2025.9" },
    { name: "Beijing Qinghua Tongheng Planning and Design Institute Co., Ltd. (THUPDI)", position: "Intern", time: "2025.11-2026.1" },
    { name: "China United Northwest Institute for Engineering Design & Research Co., Ltd.", position: "Architecture Intern", time: "2026.3-2026.6" },
    { name: "Diyouni Design Institute", position: "Teaching Assistant", time: "" },
    { name: "Zhuchuang Architectural Design Studio", position: "Architecture Intern", time: "2026.1-2026.3" }
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