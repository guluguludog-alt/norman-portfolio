import React from 'react';
import { motion } from 'framer-motion';
import './Project1.css';

export default function Project1() {
  return (
    <div className="project-detail-page project1-page">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="project-hero-title">
          International Port Culture Service Center
        </h1>
        <p className="project-description">
          This is a sandbox for you to build out the deeply customized, complex layout for Project 1. 
          You can add massive hero images, scroll-triggered animations (using framer-motion useScroll), 
          3D elements, or extensive text descriptions here.
        </p>
      </motion.div>
      
      {/* 留出大量空间以便测试上下滚动 */}
      <div className="project-placeholder-gallery">
        <span>[ Complex Gallery Area Placeholder for Project 1 ]</span>
      </div>
    </div>
  );
}
