import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titles = {
  1: "International Port Culture Service Center",
  2: "Digital Industrial Park Headquarters",
  3: "Conceptual Design of New Energy Headquarters",
  4: "High-Rise Urban Mixed-Use Complex",
  5: "Adaptive Reuse Design of the Former Glass Factory"
};

const dir = path.join(__dirname, 'src', 'components', 'projects');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

for (let i = 1; i <= 5; i++) {
  const jsxContent = `import React from 'react';
import { motion } from 'framer-motion';
import './Project${i}.css';

export default function Project${i}() {
  return (
    <div className="project-detail-page project${i}-page">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="project-hero-title">
          ${titles[i]}
        </h1>
        <p className="project-description">
          This is a sandbox for you to build out the deeply customized, complex layout for Project ${i}. 
          You can add massive hero images, scroll-triggered animations (using framer-motion useScroll), 
          3D elements, or extensive text descriptions here.
        </p>
      </motion.div>
      
      {/* 留出大量空间以便测试上下滚动 */}
      <div className="project-placeholder-gallery">
        <span>[ Complex Gallery Area Placeholder for Project ${i} ]</span>
      </div>
    </div>
  );
}
`;

  const cssContent = `.project${i}-page {
  padding: 120px 40px;
  min-height: 200vh;
}

.project${i}-page .project-hero-title {
  font-size: 4rem;
  font-family: 'Dela Gothic One', sans-serif;
  margin-bottom: 20px;
  color: #ffffff;
}

.project${i}-page .project-description {
  font-size: 1.2rem;
  color: #888888;
  max-width: 800px;
  line-height: 1.6;
}

.project${i}-page .project-placeholder-gallery {
  margin-top: 100px;
  width: 100%;
  height: 600px;
  background-color: #111111;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project${i}-page .project-placeholder-gallery span {
  color: #444444;
}
`;

  fs.writeFileSync(path.join(dir, `Project${i}.jsx`), jsxContent);
  fs.writeFileSync(path.join(dir, `Project${i}.css`), cssContent);
}

console.log("Projects generated successfully.");
