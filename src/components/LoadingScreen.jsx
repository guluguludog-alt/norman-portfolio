import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './loadingScreen.css';

// =========================================
// 1. 引入所有需要强制等待加载的图片资源
// =========================================

// 通用资源
import avatarImg from '../assets/avatar.png';
import ringImg from '../assets/Ring.png';
import starBg from '../assets/Starbackground.png';
import heroImg from '../assets/hero.png';
import barImg from '../assets/Bar.png';

// 建筑画廊
import Project1 from '../assets/Project1.jpg';
import Project2 from '../assets/Project2.jpg';
import Project3 from '../assets/Project3.jpg';
import Project4 from '../assets/Project4.jpg';
import Project5 from '../assets/Project5.jpg';

// 羌族文化图片
import Qiang1 from '../assets/Qiang1.jpeg';
import Qiang2 from '../assets/Qiang2.jpeg';
import Qiang3 from '../assets/Qiang3.jpeg';
import Qiang4 from '../assets/Qiang4.jpeg';

// 景观画廊
import LProject1 from '../assets/LProject1.png';
import LProject2 from '../assets/LProject2.png';
import LProject3 from '../assets/LProject3.png';
import LProject4 from '../assets/LProject4.png';
import LProject5 from '../assets/LProject5.png';

// AIGC 作品
import GProject1 from '../assets/GProject1.png';
import GProject2 from '../assets/GProject2.png';
import GProject3 from '../assets/GProject3.png';
import GProject4 from '../assets/GProject4.png';
import GProject5 from '../assets/GProject5.png';
import GProject6 from '../assets/GProject6.png';

// MySpaceList - 猫咪
import Cat1Img from '../assets/Cat1.jpg';
import Cat2Img from '../assets/Cat2.jpg';
import Cat3Img from '../assets/Cat3.jpg';
import Cat4Img from '../assets/Cat4.jpg';
import Cat5Img from '../assets/Cat5.jpg';

// MySpaceList - 朋友
import Friends1Img from '../assets/Friends1.jpg';
import Friends2Img from '../assets/Friends2.jpg';
import Friends3Img from '../assets/Friends3.jpg';
import Friends4Img from '../assets/Friends4.jpg';

// MySpaceList - 音乐
import Music1Img from '../assets/Music1.jpg';
import Music2Img from '../assets/Music2.jpg';
import Music3Img from '../assets/Music3.jpg';
import Music4Img from '../assets/Music4.jpg';
import Music5Img from '../assets/Music5.jpg';

// MySpaceList - 电影
import Movie1Img from '../assets/Movie1.jpg';
import Movie2Img from '../assets/Movie2.jpg';
import Movie3Img from '../assets/Movie3.jpg';
import Movie4Img from '../assets/Movie4.jpg';

// MySpaceList - 游戏 & 书籍
import GamesImg from '../assets/Games.jpg';
import Books1Img from '../assets/Books1.jpg';
import Books2Img from '../assets/Books2.jpg';

// 其他组件用到的图片
import MacBookImg from '../assets/MacBook.png';
import iMacImg from '../assets/iMac.png';
import MacstudioImg from '../assets/Macstudio.png';
import ClipoInterfaceImg from '../assets/ClipoInterface.png';
import HistoryImg from '../assets/History.png';
import HistoryWindowImg from '../assets/HistoryWindow.png';
import MailiconImg from '../assets/Mailicon.png';
import FileImg from '../assets/File.png';
import GithubImg from '../assets/Github.png';
import CatStickerImg from '../assets/CatSticker1.png';
import EyesStickerImg from '../assets/EyesSticker.png';
import MenuIconImg from '../assets/MenuIcon.png';
import PlaycircleImg from '../assets/Playcircle.png';

// =========================================
// 2. 视频资源
// =========================================
import Video1Web from '../assets/Video1_web.mp4';
import Video2Web from '../assets/Video2_web.mp4';

const PRELOAD_ASSETS = [
  // 公共资源
  '/background_layer.png',
  '/pixel_layer.png',
  // 核心图片
  avatarImg, ringImg, starBg, heroImg, barImg,
  // 建筑
  Project1, Project2, Project3, Project4, Project5,
  // 羌族文化
  Qiang1, Qiang2, Qiang3, Qiang4,
  // 景观
  LProject1, LProject2, LProject3, LProject4, LProject5,
  // AIGC
  GProject1, GProject2, GProject3, GProject4, GProject5, GProject6,
  // 猫咪
  Cat1Img, Cat2Img, Cat3Img, Cat4Img, Cat5Img,
  // 朋友
  Friends1Img, Friends2Img, Friends3Img, Friends4Img,
  // 音乐
  Music1Img, Music2Img, Music3Img, Music4Img, Music5Img,
  // 电影
  Movie1Img, Movie2Img, Movie3Img, Movie4Img,
  // 游戏 & 书籍
  GamesImg, Books1Img, Books2Img,
  // 其他
  MacBookImg, iMacImg, MacstudioImg, ClipoInterfaceImg,
  HistoryImg, HistoryWindowImg, MailiconImg, FileImg, GithubImg,
  CatStickerImg, EyesStickerImg, MenuIconImg, PlaycircleImg
];

const PRELOAD_VIDEOS = [
  Video1Web,
  Video2Web,
];

// 🌟 将图片和视频实例挂载到 Window 全局对象上，防止垃圾回收
window.__PRELOADED_IMAGES_CACHE__ = window.__PRELOADED_IMAGES_CACHE__ || [];
window.__PRELOADED_VIDEOS_CACHE__ = window.__PRELOADED_VIDEOS_CACHE__ || [];

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;
    // 进度计算：图片加载 + 视频加载 + window.onload + 字体加载
    const totalItems = PRELOAD_ASSETS.length + PRELOAD_VIDEOS.length + 2; // +2 for window.onload and fonts.ready
    let completedItems = 0;

    const updateProgress = () => {
      if (!isMounted) return;
      completedItems++;
      // 前95%留给实际加载，最后5%留给结束动画缓冲
      const realProgress = Math.min(Math.round((completedItems / totalItems) * 95), 95);
      setProgress(realProgress);
    };

    const handleComplete = () => {
      if (!isMounted) return;
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 400);
    };

    // 🌟 条件1：预加载所有图片并解码
    const imageLoadPromise = new Promise((resolve) => {
      if (PRELOAD_ASSETS.length === 0) {
        updateProgress();
        resolve();
        return;
      }
      let imgLoaded = 0;
      PRELOAD_ASSETS.forEach((src) => {
        const img = new Image();
        img.src = src;
        const markAsLoaded = () => {
          window.__PRELOADED_IMAGES_CACHE__.push(img);
          imgLoaded++;
          // 每张图片加载完成都更新进度
          updateProgress();
          if (imgLoaded === PRELOAD_ASSETS.length) resolve();
        };
        if (img.decode) {
          img.decode().then(markAsLoaded).catch(markAsLoaded);
        } else {
          img.onload = markAsLoaded;
          img.onerror = markAsLoaded;
        }
      });
    });

    // 🌟 条件2：预加载所有视频 — 等待 canplaythrough 表示视频已缓冲到可播放
    const videoLoadPromise = new Promise((resolve) => {
      if (PRELOAD_VIDEOS.length === 0) {
        updateProgress();
        resolve();
        return;
      }
      let videoLoaded = 0;
      PRELOAD_VIDEOS.forEach((src) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.src = src;
        const markAsLoaded = () => {
          window.__PRELOADED_VIDEOS_CACHE__.push(video);
          videoLoaded++;
          updateProgress();
          if (videoLoaded === PRELOAD_VIDEOS.length) resolve();
        };
        // canplaythrough 表示浏览器认为可以不间断播放整个视频
        video.addEventListener('canplaythrough', markAsLoaded, { once: true });
        video.addEventListener('error', markAsLoaded, { once: true }); // 出错也放行，不阻塞
        video.load();
      });
    });

    // 🌟 条件3：window.onload — 确保页面所有资源（包括 CSS、脚本等）加载完毕
    const windowLoadPromise = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        updateProgress();
        resolve();
      } else {
        window.addEventListener('load', () => {
          updateProgress();
          resolve();
        }, { once: true });
      }
    });

    // 🌟 条件4：所有字体加载完毕
    const fontsLoadPromise = new Promise((resolve) => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          updateProgress();
          resolve();
        });
      } else {
        updateProgress();
        resolve();
      }
    });

    // 🌟 四个条件全部满足后才放行
    Promise.all([imageLoadPromise, videoLoadPromise, windowLoadPromise, fontsLoadPromise])
      .then(() => {
        // 所有资源加载完毕，补满进度到 95%
        if (isMounted) {
          setProgress(95);
          // 给一个小缓冲让动画过渡更顺滑
          setTimeout(handleComplete, 200);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [onComplete]);

  const columns = isDesktop ? [0, 1, 2, 3] : [0];

  const colVariants = {
    initial: { y: 0 },
    exit: (custom) => {
      const staggerDelay = custom.isDesktop ? (3 - custom.index) * 0.12 : 0;
      return {
        y: '-100vh',
        transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.25 + staggerDelay }
      };
    }
  };

  const contentVariants = {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease: "easeOut" } }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="loading-screen" exit="exit" initial="initial">
          <div className="loading-bg-wrapper">
            {columns.map((i) => (
              <motion.div key={i} className="loading-col" variants={colVariants} custom={{ index: i, isDesktop }} />
            ))}
          </div>
          <motion.div className="loading-content-wrapper" variants={contentVariants}>
            <div className="loading-content">
              <h1 className="loading-name">Norman Liu</h1>
              <p className="loading-percentage">{progress}%</p>
            </div>
            <div className="loading-bar-container">
              <motion.div className="loading-bar" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.15 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}