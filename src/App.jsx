import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SpeedInsights } from "@vercel/speed-insights/react"; // 🌟 新增：导入性能监测组件
import Navbar from './components/Navbar';
import AuroraEffect from './components/AuroraEffect';
import Home from './components/Home';
import Introduction from './components/Introduction';
import Programming from './components/Programming';
import ArchitectureWorks from './components/ArchitectureWorks';
import ContactPage from './components/ContactPage';
import ProjectDetailPage from './components/ProjectDetailPage';
import { useScrollSection } from './hooks/useScrollSection';

// 内部 Home 组件，用于管理单页滚动逻辑
const HomePage = () => {
  const { activeSection, scrollToSection } = useScrollSection();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section id="introduction">
        <Introduction />
      </section>
      <section id="programming">
        <Programming />
      </section>
      <section id="architecture">
        <ArchitectureWorks />
      </section>
      <section id="contact">
        <ContactPage />
      </section>
    </motion.div>
  );
};

function App() {
  return (
    <Router basename="/">
      <div className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
        {/* 全局导航栏 */}
        <Navbar />

        {/* 极光背景效果 */}
        <AuroraEffect />

        {/* 路由配置与页面切换动画 */}
        <AnimatePresence mode="wait">
          <Routes>
            {/* 主页：包含 Introduction, Programming, Architecture, Contact 等 Section */}
            <Route path="/" element={<HomePage />} />
            
            {/* 项目详情页 */}
            <Route path="/project/:id" element={<ProjectDetailPage />} />
          </Routes>
        </AnimatePresence>

        {/* 🌟 新增：Vercel Speed Insights 组件 */}
        {/* 它在页面上不可见，但会自动收集性能数据 */}
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;