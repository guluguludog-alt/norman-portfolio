import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import AMapLoader from '@amap/amap-jsapi-loader';
import { useTranslation } from 'react-i18next'; // 全局多语言钩子联动
import './LProject1.css';

// 全局配置高德安全密钥
window._AMapSecurityConfig = {
  securityJsCode: '0716992449547cb661a4b1e574a42a7b',
};

const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const JINAN_TEMP = [-0.4, 3.2, 9.4, 16.9, 22.6, 27.2, 27.5, 26.3, 22.1, 15.8, 8.1, 1.5];
const JINAN_RAIN = [5.7, 8.5, 15.3, 27.1, 46.5, 78.2, 161.1, 150.7, 58.4, 29.2, 14.5, 6.1];
const JINAN_SUN = [152.1, 160.3, 204.5, 228.6, 264.2, 241.0, 186.5, 198.6, 195.4, 201.2, 162.3, 145.6];

// 专属多语言本地字典（中文模式下 Project 保持英文不翻译）
const translations = {
  en: {
    project: "Project",
    title: "Jinan Huangtai Central Park",
    siteAnalysis: "Site Analysis",
    interactiveInterface: "Interactive Interface",
    landUse: "Land Use Allocation by Category",
    demographics: "Demographic Structure",
    climate: "Climate Data",
    precipitation: "Precipitation Data",
    sunshine: "Sunshine Duration Data",
    descriptionTitle: "Project Description",
    description: "This central park landscape planning and design project focuses on the urban renewal initiative in the Huangtai District of Jinan, centering on the in-depth design exploration and conceptual development of a planned central park. The project aims to improve the urban environment, establish a new city landmark, and integrate the profound historical and cultural heritage.",
    age0_20: "0-20 years old",
    age20_40: "20-40 years old",
    age40_60: "40-60 years old",
    age60_plus: "60+ years old",
    residential: "Residential",
    parks: "Parks & Green Spaces",
    school: "School",
    commercial: "Commercial",
    other: "Other"
  },
  zh: {
    project: "Project", 
    title: "济南黄台中央公园规划",
    siteAnalysis: "场地现状分析",
    interactiveInterface: "交互式界面", 
    landUse: "规划用地各类构成占比",
    demographics: "当地人口结构", 
    climate: "气温年标数据",
    precipitation: "年降水量季节分配数据",
    sunshine: "平均日照时数统计",
    descriptionTitle: "项目简介", 
    description: "本项目聚焦于济南黄台片区的城市更新行动，围绕规划中的中央公园展开深入的景观规划设计与概念发掘。项目旨在改善黄台片区整体生态城市环境，打造全新的绿色智慧地标，并深度融合当地历史悠久的齐鲁泉水文化底蕴。",
    age0_20: "0-20 岁",
    age20_40: "20-40 岁",
    age40_60: "40-60 岁",
    age60_plus: "60 岁以上",
    residential: "居住建筑用地",
    parks: "景观公园与公共绿地",
    school: "教育配套用地",
    commercial: "商业核心综合体",
    other: "其他市政公共设施"
  }
};

export default function LProject1() {
  const navigate = useNavigate();
  const { i18n } = useTranslation(); 
  
  const isZh = i18n.language?.startsWith('zh');
  const tDict = isZh ? translations.zh : translations.en;

  const chartTempRef = useRef(null);
  const chartRainRef = useRef(null);
  const chartSunRef = useRef(null);
  const mapRef = useRef(null); 

  const [barWidths, setBarWidths] = useState([0, 0, 0, 0, 0]);
  const [tooltip, setTooltip] = useState({ display: 'none', left: 0, top: 0, label: '', perc: '' });
  
  // 顺畅动画：控制页面级向上原位收回退出动画的状态
  const [isExiting, setIsExiting] = useState(false);

  const dotSequence = useMemo(() => [
    ...Array(23).fill({ color: 'var(--color-red)', key: 'age0_20', perc: '23%' }),
    ...Array(27).fill({ color: 'var(--color-cyan)', key: 'age20_40', perc: '27%' }),
    ...Array(30).fill({ color: 'var(--color-purple)', key: 'age40_60', perc: '30%' }),
    ...Array(20).fill({ color: 'var(--color-blue)', key: 'age60_plus', perc: '20%' })
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
      setBarWidths([50, 20, 10, 15, 5]);

      c1 = createChart(chartTempRef.current, JINAN_TEMP, 'rgb(0,37,236)');
      c2 = createChart(chartRainRef.current, JINAN_RAIN, 'rgb(111,13,235)');
      c3 = createChart(chartSunRef.current, JINAN_SUN, 'rgb(0,182,233)');

      const handleResize = () => {
        if (c1) c1.resize(); 
        if (c2) c2.resize(); 
        if (c3) c3.resize();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (c1) c1.dispose(); 
        if (c2) c2.dispose(); 
        if (c3) c3.dispose();
      };
    }, 1000);

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
        center: [117.044017, 36.714492], 
        viewMode: '2D', 
        mapStyle: 'amap://styles/79ed85c5692f07d67cfa26518ecbbce1',
        dragEnable: !isMobile, 
        keyboardEnable: false, doubleClickZoom: !isMobile 
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
      window.removeEventListener('touchstart', handleTouchOutside);
      if (visualInstance) visualInstance.destroy();
      if (mapInstance) mapInstance.destroy(); 
    };
  }, []);

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
    setTimeout(() => {
      navigate(-1);
    }, 800); 
  };

  return (
    /* 【核心修复】挂载 data-lenis-prevent 属性，全面阻断主页 Lenis 对大屏移动端触控的致命拦截 */
    <div 
      className={`lproject1-page ${isZh ? 'zh-mode' : 'en-mode'} ${isExiting ? 'is-exiting' : ''}`}
      data-lenis-prevent
    >
      <header className="lproject1-header">
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

      <div className="lproject1-pill-tooltip" style={{ display: tooltip.display, left: tooltip.left, top: tooltip.top }}>
        <div className="pill-row">{tooltip.label}</div>
        <div className="pill-row">{tooltip.perc}</div>
      </div>

      <div className="dashboard-container">
        <div className="side-column column-left">
          <div className="panel panel-landuse">
            <div className="panel-header fade-text">{tDict.landUse}</div>
            <div className="panel-body fade-text">
              <div className="land-use-list">
                {[
                  { val: 50, color: 'var(--color-yellow)', nameKey: 'residential' },
                  { val: 20, color: 'var(--color-green)', nameKey: 'parks' },
                  { val: 10, color: 'var(--color-cyan)', nameKey: 'school' },
                  { val: 15, color: 'var(--color-blue)', nameKey: 'commercial' },
                  { val: 5, color: '#ffffff', nameKey: 'other' }
                ].map((item, idx) => (
                  <div className="land-item" key={idx}>
                    <div className="progress-bar" style={{ width: `${barWidths[idx]}%` }}></div>
                    <div className="land-info">
                      <span className="perc">{item.val}%</span>
                      <span className="name">
                        <div className="land-dot" style={{ background: item.color }}></div> {isZh ? translations.zh[item.nameKey] : translations.en[item.nameKey]}
                      </span>
                    </div>
                  </div>
                ))}
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
                        animation: `lproject1-scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s forwards`
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
            <div className="panel-header fade-text">{tDict.descriptionTitle}</div>
            <div className="panel-body description-box fade-text">
              <div className="description">{tDict.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}