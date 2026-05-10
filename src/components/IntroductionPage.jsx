import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';
import './introductionPage.css';
import Aurora from './AuroraEffect';
import BorderGlow from './BorderGlow';
import ProfileCard from './ProfileCard';
import avatarImg from '../assets/avatar.png';

export default function IntroductionPage() {
  const targetRef = useRef(null);

  const dragRef = useRef(null);
  const dragX = useMotionValue(0);
  const [isCompact, setIsCompact] = useState(false);
  const animPlayedRef = useRef(false);
  const [animPlayed, setAnimPlayed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const update = () => setIsCompact(mq.matches);

    update();

    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end -50vh"]
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v >= 0.5 && !animPlayedRef.current) {
        animPlayedRef.current = true;
        setAnimPlayed(true);
      }
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [scrollYProgress]);

  const boxesX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isCompact || animPlayed ? ['0vw', '0vw', '0vw'] : ['100vw', '0vw', '0vw']
  );
  const textX = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ['0px', '300px', '600px']
  );

  const introStyles = {
    '--intro-box-height': isCompact ? 'clamp(420px, 92vw, 500px)' : 'clamp(420px, 44vw, 540px)',
    '--intro-box-width': isCompact ? 'min(86vw, 360px)' : 'clamp(250px, 24vw, 380px)',
  };

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
    <section
      id="introduction"
      className="introduction-page"
      ref={targetRef}
      style={introStyles}
    >

      {/* 🌟 第 1 层：最底层的背景水印文字 */}
      <div
        className="background-hello"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% - (var(--intro-box-height) * 0.18)))',
          fontSize: '24vw',
          fontWeight: 900,
          letterSpacing: '-1vw',
          whiteSpace: 'nowrap',
          zIndex: 0,
          pointerEvents: 'none',
          color: 'rgba(255, 255, 255, 0.08)',
          fontFamily: "'Dela Gothic One', cursive, sans-serif"
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

        {/* 提示：仅在窄屏且动画结束时显示 */}
        <motion.div 
          className="swipe-hint"
          style={{ opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]) }}
        >
          Swipe to view
        </motion.div>

        <motion.div
          className="boxes-scroll-wrapper"
          style={{ x: boxesX, width: isCompact ? '100%' : '100vw', overflowX: 'visible', overflowY: 'visible' }}
          ref={dragRef}
        >
          <motion.div
            className="boxes-container"
            drag={isCompact ? false : 'x'}
            dragConstraints={isCompact ? undefined : dragRef}
            whileTap={{ cursor: "grabbing" }}
            style={{
              x: isCompact ? 0 : dragX,
              y: isCompact ? 0 : 'clamp(-78px, -7vh, -28px)',
              cursor: isCompact ? 'default' : 'grab',
              width: isCompact ? '100%' : 'max-content',
              margin: isCompact ? '0' : '0 auto',
              padding: isCompact ? '0 16px' : '0 20px',
              height: isCompact ? 'auto' : 'var(--intro-box-height)'
            }}
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
        <motion.div className="text-row" style={{ x: textX, y: isCompact ? 0 : '58%' }}>
          <h2 className="keep-my-font-3">
            Who Am I - Skills - Education - Who Am I - Skills - Education
          </h2>
        </motion.div>

      </div>
    </section>
  );
}
