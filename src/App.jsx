import React from 'react';
// 引入 Lenis 的 React 组件
import { ReactLenis } from 'lenis/react';
import './App.css';
// 注意路径：必须包含 ./components/ 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LandscapeWorksPage from './components/LandscapeWorksPage';
import MoreWorksPage from './components/MoreWorksPage';
import AIGCWorksPage from './components/AIGCWorksPage';
import GeneratedContent from './components/GeneratedContent';
import Programming from './components/Programming';
import IntroductionPage from './components/IntroductionPage';
import ExperiencePage from './components/ExperiencePage';
import ExperienceListPage from './components/ExperienceListPage';
import ArchitectureWorks from './components/ArchitectureWorks';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectDetailPage from './components/ProjectDetailPage';

function Home() {
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <Navbar />
      <Hero />
      <IntroductionPage />
      <ExperiencePage />
      <ExperienceListPage />
      <ArchitectureWorks />
      <LandscapeWorksPage />
      <AIGCWorksPage />
      <GeneratedContent />
      <Programming />
      <MoreWorksPage />
      
      {/* 尾页 */}
      <section id="contact" className="section">
        <div className="contact-content">
          <h1>Contact me</h1>
          <p>E-mail: citiesxl@hotmail.com</p>
        </div>
        <div className="footer-blue-block">
          <p>© 2026 Yang's Architectural Design Studio. All rights reserved.</p>
        </div>
      </section>
    </ReactLenis> 
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;