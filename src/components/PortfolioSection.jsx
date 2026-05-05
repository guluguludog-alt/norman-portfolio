import React, { useState, useRef } from 'react';

export default function PortfolioSection({ id, title, subtitle }) {
  const [bgImage, setBgImage] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const trackRef = useRef(null);

  // 1. 生成 15 张稳定的占位图片
  const projects = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    img: `https://picsum.photos/seed/${id}-${i}/800/500`
  }));

  return (
    <section id={id} className="section portfolio-section">
      <div className="diffuse-light"></div>
      <div 
        className="hover-bg-overlay" 
        style={{ 
          backgroundImage: `url(${bgImage})`, 
          opacity: overlayOpacity,
          transition: 'opacity 0.6s ease' 
        }}
      ></div>
      
      <div className="section-title">
        {/* 2. 确保标签闭合 */}
        <h2>{title}<br /><span>{subtitle}</span></h2>
      </div>

      <div className="gallery-wrapper">
        <div className="gallery-track" ref={trackRef}>
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              className="gallery-item"
              onMouseEnter={() => {
                setBgImage(proj.img);
                setOverlayOpacity(0.3);
              }}
              onMouseLeave={() => setOverlayOpacity(0)}
            >
              <img src={proj.img} alt={`${title} ${proj.id}`} />
              <div className="project-title">{title} Project {proj.id}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="scroll-hint">Drag or use trackpad to slide <br /> →</div>
    </section>
  );
}