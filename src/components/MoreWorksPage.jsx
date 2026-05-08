import React, { useState, useRef } from 'react';
import './moreWorksPage.css';

export default function MoreWorksPage() {
  const [bgImage, setBgImage] = useState('');
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const trackRef = useRef(null);

  const projects = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    img: `https://picsum.photos/seed/more-${i}/800/500`
  }));

  return (
    <section id="more" className="section more-portfolio-section">
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
        <h2>More<br /><span>works</span></h2>
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
              <img src={proj.img} alt={`More ${proj.id}`} />
              <div className="project-title">More Project {proj.id}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="scroll-hint">Drag or use trackpad to slide <br /> →</div>
    </section>
  );
}
