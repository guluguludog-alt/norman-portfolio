import React, { useRef, useState, useCallback } from 'react';
import './aigcWorksPage.css';

import videoFile from '../assets/Video1.mp4';

export default function AIGCWorksPage() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const handleLoadedMetadata = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const w = vid.videoWidth;
    const h = vid.videoHeight;
    if (w && h) setAspectRatio(w / h);
  }, []);

  return (
    <section
      id="aigc"
      className="aigc-portfolio-section"
      ref={sectionRef}
      style={{ '--video-ratio': aspectRatio }}
    >
      <div className="aigc-video-container">
        <video
          ref={videoRef}
          src={videoFile}
          className="aigc-scroll-video"
          preload="auto"
          muted
          playsInline
          autoPlay
          loop
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
    </section>
  );
}