import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import './introductionPage.css';
import Aurora from './AuroraEffect';
import BorderGlow from './BorderGlow';
import ProfileCard from './ProfileCard';
import avatarImg from '../assets/avatar.png';

export default function IntroductionPage() {
  const targetRef = useRef(null);

  const dragRef = useRef(null);
  const dragX = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Reset drag position when the section scrolls completely out of view (from either top or bottom)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest <= 0.05 || latest >= 0.95) {
      dragX.set(0);
    }
  });

  const boxesX = useTransform(scrollYProgress, [0, 0.5, 1], ["100vw", "0vw", "0vw"]);
  const textX = useTransform(scrollYProgress, [0, 0.5, 1], ["-100vw", "0vw", "30vw"]);

  const skills = [
    { name: "Sketch up", percent: "90%" },
    { name: "Rhino", percent: "88%" },
    { name: "AutoCAD", percent: "80%" },
    { name: "Photoshop", percent: "95%" },
    { name: "Illustrator", percent: "85%" },
    { name: "Vibe Coding", percent: "65%" },
    { name: "CET-6", percent: "90%" }
  ];

  return (
    <section id="introduction" className="introduction-page" ref={targetRef}>

      {/* 🌟 第 1 层：最底层的背景水印文字 */}
      <div
        className="background-hello"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          fontSize: '24vw',
          fontWeight: 900,
          letterSpacing: '-1vw',
          whiteSpace: 'nowrap',
          zIndex: 0,
          pointerEvents: 'none',
          color: 'rgba(255, 255, 255, 0.08)',
          fontFamily: '"STHeiti", "华文黑体", sans-serif'
        }}
      >
        Hello!
      </div>

      {/* 🌟 第 2 层：极光背景层 */}
      <div className="aurora-bg-wrapper" style={{ zIndex: 1 }}>
        <Aurora
          colorStops={["#8599d2", "#0016d8", "#5211dd"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* 🌟 第 3 层：交互内容层 */}
      <div className="intro-content">

        <motion.div
          className="boxes-scroll-wrapper"
          style={{ x: boxesX, width: '100vw', overflowX: 'clip', overflowY: 'visible' }}
          ref={dragRef}
        >
          <motion.div
            className="boxes-container"
            drag="x"
            dragConstraints={dragRef}
            whileTap={{ cursor: "grabbing" }}
            style={{ x: dragX, cursor: "grab", width: "max-content", margin: "0 auto", padding: "0 20px" }}
          >

            {/* 左侧：Skills 框 */}
            <BorderGlow
              className="glass-box"
              backgroundColor="rgba(255, 255, 255, 0.03)"
              borderRadius={24}
              glowColor="240 80 70"
              colors={['#8599d2', '#0016d8', '#5211dd']}
              fillOpacity={0}
            >
              <div className="box-inner-content">
                <h3 className="box-title">Skills</h3>
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div className="skill-item" key={index}>
                      <span className="skill-name">{skill.name}</span>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: skill.percent }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BorderGlow>

            {/* 中间：3D Profile Card */}
            <ProfileCard
              name="Liu Yuyang"
              title="Designer"
              avatarUrl={avatarImg}
              showUserInfo={false}
              enableTilt={true}
              behindGlowEnabled={false}
              innerGradient="linear-gradient(145deg, rgba(20,20,40,0.8) 0%, rgba(82,17,221,0.2) 100%)"
            />

            {/* 右侧：Education 框 */}
            <BorderGlow
              className="glass-box"
              backgroundColor="rgba(255, 255, 255, 0.03)"
              borderRadius={24}
              glowColor="240 80 70"
              colors={['#8599d2', '#0016d8', '#5211dd']}
              fillOpacity={0}
            >
              <div className="box-inner-content">
                <h3 className="box-title">Education</h3>

                <div className="edu-item">
                  <h4 className="school-name">Shandong Jianzhu University</h4>
                  <div className="edu-divider"></div>
                  <div className="edu-details">
                    <span className="major">Landscape Architecture</span>
                    <span className="degree blue-text">Bachelor</span>
                  </div>
                </div>

                <div className="edu-item" style={{ marginTop: '40px' }}>
                  <h4 className="school-name">Xi'an University of<br />Architecture and Technology</h4>
                  <div className="edu-divider"></div>
                  <div className="edu-details">
                    <span className="major">Architecture</span>
                    <span className="degree blue-text">Master</span>
                  </div>
                </div>
              </div>
            </BorderGlow>

          </motion.div>
        </motion.div>

        {/* 底部滑动大字 */}
        <motion.div className="text-row" style={{ x: textX, y: '50%' }}>
          <h2 className="keep-my-font-3">
            Who Am I - Skills - Education - Who Am I - Skills - Education
          </h2>
        </motion.div>

      </div>
    </section>
  );
}