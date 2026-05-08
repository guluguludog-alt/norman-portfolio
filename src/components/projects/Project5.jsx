import React from 'react';
import { motion } from 'framer-motion';
import './Project5.css';

export default function Project5() {
  return (
    <div className="project-detail-page project5-page">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="project-hero-title">
          Adaptive Reuse Design of the Former Glass Factory
        </h1>
        <p className="project-description">
          This is a sandbox for you to build out the deeply customized, complex layout for Project 5. 
          You can add massive hero images, scroll-triggered animations (using framer-motion useScroll), 
          3D elements, or extensive text descriptions here.
        </p>
      </motion.div>
      
      {/* 留出大量空间以便测试上下滚动 */}
      <div className="project-placeholder-gallery">
        <span>[ Complex Gallery Area Placeholder for Project 5 ]</span>
      </div>
    </div>
  );
}
