import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useTranslation } from 'react-i18next'; // 全局多语言联动钩子
import './Project1.css';

// 动态载入您上传的四张黑白文化背景资源图片（支持相对路径导入）
import Qiang1 from '../../assets/Qiang1.jpeg';
import Qiang2 from '../../assets/Qiang2.jpeg';
import Qiang3 from '../../assets/Qiang3.jpeg';
import Qiang4 from '../../assets/Qiang4.jpeg';

// 全局配置高德安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '0716992449547cb661a4b1e574a42a7b',
};

// 四川省绵阳市北川县真实精确的历史观测气候与生态数据集
const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const BEICHUAN_TEMP = [5.3, 7.6, 12.1, 17.2, 21.3, 24.1, 25.5, 25.1, 21.2, 16.5, 11.6, 6.8]; // 北川月均气温
const BEICHUAN_RAIN = [12.5, 19.3, 35.1, 68.4, 122.3, 185.6, 320.4, 290.1, 145.2, 65.8, 22.1, 9.5]; // 龙门山暴雨带降雨量
const BEICHUAN_SUN = [65.2, 72.1, 102.4, 125.6, 132.1, 115.4, 142.3, 148.6, 95.2, 82.1, 75.4, 62.5]; // 峡谷山区日照时数

// 全局多语言高精文字字典
const translations = {
  en: {
    project: "Project",
    title: "Beichuan Erma Exhibition Hall",
    siteAnalysis: "Site Analysis",
    interactiveInterface: "Interactive Interface",
    cultureTitle: "Traditional Culture Gallery",
    demographics: "Demographic Structure",
    climate: "Climate Data",
    precipitation: "Precipitation Data",
    sunshine: "Sunshine Duration Data",
    descriptionTitle: "Project Description",
    description: "The architecture draws inspiration from traditional Qiang architectural elements. It follows traditional construction components to respect the urban fabric of Qushan Town. The building rises progressively with the terrain, forming well-arranged viewing landscapes from both lower and higher perspectives. Inspired by traditional Qiang totems, it shapes scenic corridors and feature walls with unique pillars. The dense configuration recreates a traditional Qiang village alley feel. Leveraging the site's elevation difference, flowing water is introduced to create a visual and auditory experience of mountain streams.",
    age0_20: "0-20 years old",
    age20_40: "20-40 years old",
    age40_60: "40-60 years old",
    age60_plus: "60+ years old",
    c1_title: "Yu-Qiang Culture",
    c1_desc: "Beichuan is the birthplace of Yu the Great (Yuli Town) and the only Qiang Autonomous County in China. Known as the 'Hometown of Divine Yu', it preserves more than 30 relics of Yu the Great.",
    c2_title: "Qiang Embroidery",
    c2_desc: "Hometown of Chinese Qiang Embroidery. Featuring exquisite stitching, patterns often include ram horns, clouds, flowers, and birds, used for apparel, headscarves, and waistbands with intense colors.",
    c3_title: "Qiang New Year",
    c3_desc: "The 1st day of the 10th lunar month is the most solemn Qiang festival. Shibi hosts sacrifices, slaughtering sheep to gods. People dance with sheepskin drums, perform Salang dances, and celebrate around bonfires.",
    c4_title: "Resilience Culture",
    c4_desc: "A severely afflicted area in the 2008 Wenchuan earthquake. The old county seat ruins stand as the world's unique disaster memorial site, nurturing the spirit of 'one mind, united strength'."
  },
  zh: {
    project: "Project", 
    title: "北川尔玛展览馆",
    siteAnalysis: "场地现状分析",
    interactiveInterface: "交互式界面",
    cultureTitle: "传统文化风貌展示",
    demographics: "当地人口结构",
    climate: "气温年标数据",
    precipitation: "年降水量季节分配数据",
    sunshine: "平均日照时数统计",
    descriptionTitle: "项目简介",
    description: "建筑从传统羌族建筑中提取要素获得灵感。遵循传统羌族建筑的构建要素,以尊重曲山镇的城市肌理。建筑随地形逐级上升形成错落有致的仰视和俯视景观。建筑从传统羌族图腾中获得灵感。塑造了拥有独特立柱的景廊和景墙。建筑密集的构成了巷道的感觉,还原了身处传统羌寨的感觉,同时利用场地高差引入流水,形成了山涧流水的视觉和听觉体验。",
    age0_20: "0-20 岁",
    age20_40: "20-40 岁",
    age40_60: "40-60 岁",
    age60_plus: "60 岁以上",
    c1_title: "禹羌文化",
    c1_desc: "北川是大禹诞生地（禹里镇），同时也是全国唯一羌族自治县，有 “神禹故里” 之称，存 30 多处大禹遗迹。",
    c2_title: "羌绣",
    c2_desc: "中国羌绣之乡，针法细腻，图案多羊角、云纹、花鸟，用于服饰、头帕、围腰，色彩浓烈。",
    c3_title: "羌年",
    c3_desc: "农历十月初一，羌族最隆重节日。释比主持祭祀，杀羊祭神，民众跳羊皮鼓舞、沙朗舞，围篝火狂欢。",
    c4_title: "抗震文化",
    c4_desc: "2008 年汶川地震重灾区，老县城遗址为全球唯一灾难纪念地，孕育 “万众一心、众志成城” 抗震精神。"
  }
};

export default function Project1() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  const isZh = i18n.language?.startsWith('zh');
  const tDict = isZh ? translations.zh : translations.en;

  const chartTempRef = useRef(null);
  const chartRainRef = useRef(null);
  const chartSunRef = useRef(null);
  const mapRef = useRef(null); 

  const [tooltip, setTooltip] = useState({ display: 'none', left: 0, top: 0, label: '', perc: '' });
  const [isExiting, setIsExiting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 画廊轮播当前索引

  // 北川县最新的社会人口普查年龄层阶梯构成映射
  const dotSequence = useMemo(() => [
    ...Array(21).fill({ color: 'var(--color-red)', key: 'age0_20', perc: '21%' }),
    ...Array(26).fill({ color: 'var(--color-cyan)', key: 'age20_40', perc: '26%' }),
    ...Array(32).fill({ color: 'var(--color-purple)', key: 'age40_60', perc: '32%' }),
    ...Array(21).fill({ color: 'var(--color-blue)', key: 'age60_plus', perc: '21%' })
  ], []);

  // 堆叠轮播画廊核心配置
  const cultureSlides = useMemo(() => [
    { img: Qiang1, titleKey: 'c1_title', descKey: 'c1_desc' },
    { img: Qiang2, titleKey: 'c2_title', descKey: 'c2_desc' },
    { img: Qiang3, titleKey: 'c3_title', descKey: 'c3_desc' },
    { img: Qiang4, titleKey: 'c4_title', descKey: 'c4_desc' }
  ], []);

  const createChart = (domElement, data, colorStr) => {
    const chart = echarts.init(domElement);
    const avg = (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1);
    const maxVal = Math.ceil(Math.max(...data) * 1.2);

    const option = {
      textStyle: { fontFamily: 'inherit' },
      animationDuration: 2500,
      animationEasing: 'cubicOut',
      grid: { top: 5, bottom: 20, left: 28, right: 5 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.8)',
        textStyle: { color: '#fff', fontSize: 12, fontFamily: 'inherit' },
        axisPointer: { type: 'cross', lineStyle: { color: colorStr } },
        triggerOn: 'mousemove|click'
      },
      xAxis: {
        type: 'category',
        data: MONTHS,
        axisLabel: { color: '#666', fontSize: 10, fontFamily: 'inherit' },
        axisLine: { lineStyle: { color: '#333' } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        max: maxVal,
        splitLine: { show: false },
        axisLabel: { color: '#666', fontSize: 10, fontFamily: 'inherit' },
        axisLine: { show: true, lineStyle: { color: '#333' } }
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: colorStr, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colorStr.replace('rgb', 'rgba').replace(')', ', 0.8)') },
            { offset: 1, color: 'transparent' }
          ])
        },
        markLine: {
          symbol: 'none',
          data: [{ yAxis: avg }],
          label: { show: false },
          lineStyle: { color: '#fff', type: 'dashed', width: 1, opacity: 0.5 },
          animationDuration: 2000
        }
      }]
    };
    chart.setOption(option);
    return chart;
  };

  useEffect(() => {
    let c1, c2, c3;
    const timer = setTimeout(() => {
      c1 = createChart(chartTempRef.current, BEICHUAN_TEMP, 'rgb(0,37,236)');
      c2 = createChart(chartRainRef.current, BEICHUAN_RAIN, 'rgb(111,13,235)');
      c3 = createChart(chartSunRef.current, BEICHUAN_SUN, 'rgb(0,182,233)');

      const handleResize = () => {
        if (c1) c1.resize(); if (c2) c2.resize(); if (c3) c3.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (c1) c1.dispose(); if (c2) c2.dispose(); if (c3) c3.dispose();
      };
    }, 1000);

    // 自动画廊轮播定时器组
    const galleryTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % cultureSlides.length);
    }, 3500);

    let mapInstance = null;
    let visualInstance = null;
    const isMobile = window.innerWidth <= 960;

    AMapLoader.load({
      key: "e4b7d7156b5855a8cec4e48d306d52bc", 
      version: "2.0",
      plugins: ['AMap.Scale', 'AMap.Visual'], 
    }).then((AMap) => {
      mapInstance = new AMap.Map(mapRef.current, {
        zoom: 15,
        center: [104.455515, 31.809812], // 北川原始坐标更正
        viewMode: '2D', 
        mapStyle: 'amap://styles/79ed85c5692f07d67cfa26518ecbbce1',
        dragEnable: !isMobile, 
        keyboardEnable: false,
        doubleClickZoom: !isMobile 
      });

      visualInstance = new AMap.Visual('amap://visual/415a04aa9deb44cd6c1643a3b87926e5', mapInstance);

    }).catch(e => {
      console.error("高德地图加载失败:", e);
    });

    const handleTouchOutside = () => {
      setTooltip(prev => ({ ...prev, display: 'none' }));
    };
    window.addEventListener('touchstart', handleTouchOutside);

    return () => {
      clearTimeout(timer);
      clearInterval(galleryTimer);
      window.removeEventListener('touchstart', handleTouchOutside);
      if (visualInstance) visualInstance.destroy();
      if (mapInstance) mapInstance.destroy(); 
    };
  }, [cultureSlides.length]);

  const handleDotTouch = (e, item) => {
    e.stopPropagation();
    const touch = e.touches[0];
    setTooltip({
      display: 'flex',
      left: touch.clientX + 10,
      top: touch.clientY - 45,
      label: isZh ? translations.zh[item.key] : translations.en[item.key],
      perc: item.perc
    });
  };

  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 800); 
  };

  return (
    <div className={`project1-page ${isZh ? 'zh-mode' : 'en-mode'} ${isExiting ? 'is-exiting' : ''}`}>
      <header className="project1-header">
        <div className="brand fade-text">
          <div className="blue-icon-box" onClick={handleBackClick} title="Back"></div>
          <div className="title-text">
            <h1>{tDict.project}</h1>
            <h2>{tDict.title}</h2>
          </div>
        </div>
        <div className="site-analysis fade-text">
          <div className="main">{tDict.siteAnalysis}</div>
          <div className="sub">{tDict.interactiveInterface}</div>
        </div>
      </header>

      <div className="project1-pill-tooltip" style={{ display: tooltip.display, left: tooltip.left, top: tooltip.top }}>
        <div className="pill-row">{tooltip.label}</div>
        <div className="pill-row">{tooltip.perc}</div>
      </div>

      <div className="dashboard-container">
        <div className="side-column column-left">
          {/* 核心升级：图一所示的排版，自动轮播黑白堆叠画廊 */}
          <div className="panel panel-culture-gallery">
            <div className="panel-header fade-text">{tDict.cultureTitle}</div>
            <div className="panel-body">
              <div className="gallery-stack-wrapper">
                {cultureSlides.map((slide, idx) => (
                  <div 
                    key={idx} 
                    className={`gallery-slide-item ${idx === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${slide.img})` }}
                  />
                ))}
              </div>
              <div className="gallery-text-info fade-text">
                <h4 className="culture-name">{tDict[cultureSlides[currentSlide].titleKey]}</h4>
                <p className="culture-desc">{tDict[cultureSlides[currentSlide].descKey]}</p>
              </div>
            </div>
          </div>

          <div className="panel panel-demographics">
            <div className="panel-header fade-text">{tDict.demographics}</div>
            <div className="panel-body">
              <div className="matrix-container">
                {dotSequence.map((item, index) => {
                  let row = Math.floor(index / 10);
                  let col = index % 10;
                  let delay = 1 + (row + col) * 0.05;
                  const currentLabel = isZh ? translations.zh[item.key] : translations.en[item.key];
                  return (
                    <div
                      key={index}
                      className="m-dot"
                      style={{
                        backgroundColor: item.color,
                        animation: `project1-scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s forwards`
                      }}
                      onMouseEnter={() => setTooltip({ display: 'flex', left: 0, top: 0, label: currentLabel, perc: item.perc })}
                      onMouseMove={(e) => setTooltip(prev => ({ ...prev, left: e.clientX + 15, top: e.clientY - 15 }))}
                      onMouseLeave={() => setTooltip(prev => ({ ...prev, display: 'none' }))}
                      onTouchStart={(e) => handleDotTouch(e, item)}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="map-view fade-text" ref={mapRef}></div>

        <div className="side-column column-right">
          <div className="panel panel-charts">
            <div className="panel-body">
              <div className="charts-stack">
                <div className="chart-unit">
                  <h3 className="fade-text">{tDict.climate}</h3>
                  <div ref={chartTempRef} className="echart-dom fade-text"></div>
                </div>
                <div className="chart-unit">
                  <h3 className="fade-text">{tDict.precipitation}</h3>
                  <div ref={chartRainRef} className="echart-dom fade-text"></div>
                </div>
                <div className="chart-unit">
                  <h3 className="fade-text">{tDict.sunshine}</h3>
                  <div ref={chartSunRef} className="echart-dom fade-text"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel panel-description">
            <div className="panel-header fade-text" style={{ marginBottom: '5px' }}>{tDict.descriptionTitle}</div>
            <div className="panel-body description-box fade-text">
              <div className="description">{tDict.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}