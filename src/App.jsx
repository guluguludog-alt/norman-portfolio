import React, { useState, useEffect } from 'react';
import { ReactLenis } from 'lenis/react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LandscapeWorksPage from './components/LandscapeWorksPage';
import AIGCWorksPage from './components/AIGCWorksPage';
import GeneratedContent from './components/GeneratedContent';
import Programming from './components/Programming';
import MySpacePage from './components/MySpacePage';
import MySpaceListPage from './components/MySpaceListPage';
import ContactPage from './components/ContactPage';
import IntroductionPage from './components/IntroductionPage';
import ExperiencePage from './components/ExperiencePage';
import ExperienceListPage from './components/ExperienceListPage';
import ArchitectureWorks from './components/ArchitectureWorks';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectDetailPage from './components/ProjectDetailPage';
import LoadingScreen from './components/LoadingScreen'; 
import ResourcesPage from './components/ResourcesPage';
import { Analytics } from '@vercel/analytics/react';

function Home() {
  // 核心优化：利用 sessionStorage 缓存状态，防止用户返回主页时重新激活 LoadingScreen 幕布导致闪烁黑屏
  const [isAppLoaded, setIsAppLoaded] = useState(() => {
    return sessionStorage.getItem('global_app_loaded') === 'true';
  });

  useEffect(() => {
    if (!isAppLoaded) {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isAppLoaded]);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('global_app_loaded', 'true');
    setIsAppLoaded(true);
  };

  return (
    <>
      {!isAppLoaded && <LoadingScreen onComplete={handleLoadingComplete} />}

      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        <Navbar />
        <Hero isAppLoaded={isAppLoaded} />
        <IntroductionPage />
        <ExperiencePage />
        <ExperienceListPage />
        <ArchitectureWorks />
        <LandscapeWorksPage />
        <AIGCWorksPage />
        <GeneratedContent />
        <Programming />
        <MySpacePage />
        <MySpaceListPage />
        <ContactPage />
      </ReactLenis> 
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        {/* 底层主页常驻，保留全站滚动位置与生命周期 */}
        <Home />
        
        <Routes>
          <Route path="/" element={null} />
          {/* 高层悬浮遮罩通道，原位向下擦出 */}
          <Route path="/project/:projectId" element={<ProjectDetailPage />} />
          {/* 资源下载页面 */}
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </Router>
      <Analytics />
    </>
  );
}

export default App;