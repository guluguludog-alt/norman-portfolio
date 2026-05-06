import React from 'react';
// 引入 Lenis 的 React 组件
import { ReactLenis } from 'lenis/react';
import './App.css';
// 注意路径：必须包含 ./components/ 
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PortfolioSection from './components/PortfolioSection';
import IntroductionPage from './components/IntroductionPage';
import ExperiencePage from './components/ExperiencePage';
import ExperienceListPage from './components/ExperienceListPage';
import ArchitectureWorks from './components/ArchitectureWorks';

function App() {
  return (
    // 用 ReactLenis 替换原本的空标签 <>，并加入配置项
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      <Navbar />
      <Hero />
      <IntroductionPage />
      <ExperiencePage />
      <ExperienceListPage />
      <ArchitectureWorks />
      <PortfolioSection id="architecture" title="Architecture" subtitle="works" />
      <PortfolioSection id="landscape" title="Landscape" subtitle="works" />
      <PortfolioSection id="more" title="More" subtitle="works" />
      
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

export default App;