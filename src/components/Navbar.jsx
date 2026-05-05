import React from 'react'; 
import GlassSurface from './GlassSurface'; 
import './Navbar.css';

export default function Navbar() { 
  return (
    <>
      {/* 1. 导航栏容器（液态玻璃） */}
      <header className="navbar-wrapper">
        <GlassSurface 
          width="800px"       
          height="40px"       
          borderRadius={30}   
          blur={15}           
          opacity={0.8}       
          className="navbar-glass" 
        >
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#architecture">Architecture</a>
            <a href="#landscape">Landscape</a>
            <a href="#more">More</a>
          </nav>
        </GlassSurface>
      </header>

      {/* 2. 彻底独立的 Contact me 按钮 (直接把样式写在标签里，强制生效) */}
      <a 
        href="#contact" 
        className="contact-btn"
      >
        Contact me
      </a>
    </>
  );
}