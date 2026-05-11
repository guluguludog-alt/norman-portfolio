import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import './App.css';
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
import LoadingScreen from './components/LoadingScreen'; // 🌟 引入刚建好的加载页

function Home() {
  // 记录整个网站资源是否加载完毕的全局状态
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // 在加载页未消失前，把滚动强制锁死在最顶部，防止手抖滑到下面
  useEffect(() => {
    if (!isAppLoaded) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isAppLoaded]);

  return (
    <>
      {/* 🌟 放置加载幕布，当它触发完成时更新全局状态 */}
      <LoadingScreen onComplete={() => setIsAppLoaded(true)} />

      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        <Navbar />
        {/* 🌟 将状态传递给 Hero，让 Hero 等幕布拉开再播放酷炫入场 */}
        <Hero isAppLoaded={isAppLoaded} />
        <IntroductionPage />
        <ExperiencePage />
        <ExperienceListPage />
        <ArchitectureWorks />
        <LandscapeWorksPage />
        <AIGCWorksPage />
        <GeneratedContent />
        <Programming />
        <MoreWorksPage />
        
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
    </>
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