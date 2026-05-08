import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titles = {
  1: "Jinan Huangtai Central Park",
  2: "Ecological Bird Habitat Riverside Park",
  3: "Qianfo Mountain Plaza",
  4: "Jiangshan Mountain Park",
  5: "FISU Games Themed Floral Landscape Design"
};

const dir = path.join(__dirname, 'src', 'components', 'projects');

for (let i = 1; i <= 5; i++) {
  const jsxContent = `import React from 'react';
import { motion } from 'framer-motion';
import './LProject${i}.css';

export default function LProject${i}() {
  return (
    <div className="project-detail-page lproject${i}-page">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="project-hero-title">
          ${titles[i]}
        </h1>
        <p className="project-description">
          This is a sandbox for you to build out the deeply customized, complex layout for Landscape Project ${i}. 
          You can add massive hero images, scroll-triggered animations (using framer-motion useScroll), 
          3D elements, or extensive text descriptions here.
        </p>
      </motion.div>
      
      {/* 留出大量空间以便测试上下滚动 */}
      <div className="project-placeholder-gallery">
        <span>[ Complex Gallery Area Placeholder for LProject ${i} ]</span>
      </div>
    </div>
  );
}
`;

  const cssContent = `.lproject${i}-page {
  padding: 120px 40px;
  min-height: 200vh;
}

.lproject${i}-page .project-hero-title {
  font-size: 4rem;
  font-family: 'Dela Gothic One', sans-serif;
  margin-bottom: 20px;
  color: #ffffff;
}

.lproject${i}-page .project-description {
  font-size: 1.2rem;
  color: #888888;
  max-width: 800px;
  line-height: 1.6;
}

.lproject${i}-page .project-placeholder-gallery {
  margin-top: 100px;
  width: 100%;
  height: 600px;
  background-color: #111111;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lproject${i}-page .project-placeholder-gallery span {
  color: #444444;
}
`;

  fs.writeFileSync(path.join(dir, `LProject${i}.jsx`), jsxContent);
  fs.writeFileSync(path.join(dir, `LProject${i}.css`), cssContent);
}

console.log("LProjects generated successfully.");
