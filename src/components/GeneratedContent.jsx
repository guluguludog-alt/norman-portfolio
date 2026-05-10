import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import './generatedContent.css';

export default function GeneratedContent() {
  const sectionRef = useRef(null);
  
  // ===========================================
  // 核心缓冲/截断逻辑 (原封不动保留，完美防错位)
  // ===========================================
  const [triggerPoint, setTriggerPoint] = useState(999999);

  useLayoutEffect(() => {
    const updatePoint = () => {
      if (sectionRef.current) {
        setTriggerPoint(sectionRef.current.offsetTop);
      }
    };
    updatePoint();
    window.addEventListener('resize', updatePoint);
    return () => window.removeEventListener('resize', updatePoint);
  }, []);

  const { scrollY } = useScroll();
  const clampedScrollY = useTransform(scrollY, (y) => Math.min(y, triggerPoint));
  const smoothClampedScrollY = useSpring(clampedScrollY, { stiffness: 100, damping: 30 });
  const springOffset = useTransform(() => clampedScrollY.get() - smoothClampedScrollY.get());

  return (
    <motion.section 
      id="generated-content" 
      className="generated-content-page"
      ref={sectionRef}
      style={{ y: springOffset }} // 将惯性完美赋给整个页面
    >
      {/* 严格对照原图的 12x4 精确网格布局 */}
      <div className="gc-grid">
        
        {/* === Column 1 === */}
        <div className="gc-box gc-blue-box box-t1">
          <h2 className="gc-title">Title1</h2>
          <div className="gc-subtitle">Subtitle 1</div>
          <div className="gc-arrow gc-arrow-br">➔</div>
        </div>
        <div className="gc-box gc-grey-box box-g1">
          <img src="https://picsum.photos/seed/g1/600/400" alt="Proj 1" />
        </div>
        <div className="gc-box gc-grey-box box-g2">
          <img src="https://picsum.photos/seed/g2/600/400" alt="Proj 2" />
        </div>
        <div className="gc-box gc-blue-box box-t2">
          <h2 className="gc-title">Title2</h2>
          <div className="gc-subtitle">Subtitle 2</div>
          <div className="gc-arrow gc-arrow-br">➔</div>
        </div>

        {/* === Column 2 === */}
        <div className="gc-box gc-grey-box box-lg1">
          <img src="https://picsum.photos/seed/lg1/600/800" alt="Large Proj 1" />
        </div>
        <div className="gc-box gc-grey-box box-lg2">
          <img src="https://picsum.photos/seed/lg2/600/800" alt="Large Proj 2" />
        </div>

        {/* === Column 3 === */}
        <div className="gc-box gc-blue-box box-t3">
          <h2 className="gc-title">Title3</h2>
          <div className="gc-subtitle">Subtitle 3</div>
        </div>
        <div className="gc-box gc-grey-box box-g3">
          <img src="https://picsum.photos/seed/g3/300/400" alt="Proj 3" />
        </div>
        <div className="gc-box gc-grey-box box-g4">
          <img src="https://picsum.photos/seed/g4/600/400" alt="Proj 4" />
        </div>
        <div className="gc-box gc-grey-box box-g5">
          <img src="https://picsum.photos/seed/g5/600/400" alt="Proj 5" />
        </div>
        <div className="gc-box gc-blue-box box-t4">
          <h2 className="gc-title">Title4</h2>
          <div className="gc-subtitle">Subtitle 4</div>
        </div>
        <div className="gc-box gc-grey-box box-g6">
          <img src="https://picsum.photos/seed/g6/300/400" alt="Proj 6" />
        </div>

        {/* === Column 4 === */}
        <div className="gc-box gc-grey-box box-g7">
          <img src="https://picsum.photos/seed/g7/300/400" alt="Proj 7" />
        </div>
        <div className="gc-box gc-blue-box box-t5">
          <h2 className="gc-title">Title5</h2>
          <div className="gc-subtitle">Subtitle 5</div>
          <div className="gc-arrow gc-arrow-br">↓</div>
        </div>
        <div className="gc-box gc-grey-box box-g8">
          <img src="https://picsum.photos/seed/g8/600/400" alt="Proj 8" />
        </div>
        <div className="gc-box gc-grey-box box-g9">
          <img src="https://picsum.photos/seed/g9/600/400" alt="Proj 9" />
        </div>
        <div className="gc-box gc-grey-box box-g10">
          <img src="https://picsum.photos/seed/g10/300/400" alt="Proj 10" />
        </div>
        <div className="gc-box gc-blue-box box-t6">
          <h2 className="gc-title">Title6</h2>
          <div className="gc-subtitle">Subtitle 6</div>
          {/* 注意看参考图，Title6 的箭头在右上角并且是向上的 */}
          <div className="gc-arrow gc-arrow-tr">↑</div> 
        </div>

      </div>
    </motion.section>
  );
}