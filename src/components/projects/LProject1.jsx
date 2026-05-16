import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts';
import AMapLoader from '@amap/amap-jsapi-loader';
import './LProject1.css';

window._AMapSecurityConfig = {
  securityJsCode: '0716992449547cb661a4b1e574a42a7b',
};

const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const JINAN_TEMP = [-0.4, 3.2, 9.4, 16.9, 22.6, 27.2, 27.5, 26.3, 22.1, 15.8, 8.1, 1.5];
const JINAN_RAIN = [5.7, 8.5, 15.3, 27.1, 46.5, 78.2, 161.1, 150.7, 58.4, 29.2, 14.5, 6.1];
const JINAN_SUN = [152.1, 160.3, 204.5, 228.6, 264.2, 241.0, 186.5, 198.6, 195.4, 201.2, 162.3, 145.6];

export default function LProject1() {
  const navigate = useNavigate();
  
  const chartTempRef = useRef(null);
  const chartRainRef = useRef(null);
  const chartSunRef = useRef(null);
  const mapRef = useRef(null); 

  const [barWidths, setBarWidths] = useState([0, 0, 0, 0, 0]);
  const [tooltip, setTooltip] = useState({ display: 'none', left: 0, top: 0, label: '', perc: '' });

  const dotSequence = useMemo(() => [
    ...Array(23).fill({ color: 'var(--color-red)', label: '0-20岁', perc: '23%' }),
    ...Array(27).fill({ color: 'var(--color-cyan)', label: '20-40岁', perc: '27%' }),
    ...Array(30).fill({ color: 'var(--color-purple)', label: '40-60岁', perc: '30%' }),
    ...Array(20).fill({ color: 'var(--color-blue)', label: '60岁以上', perc: '20%' })
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
      // 触控优化：支持移动端单指滑动查看 ECharts 数据提示，并禁用多余手势
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

    // 检测当前屏幕宽度是否为窄屏设备
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
        
        // 【核心触控优化】解决地图区域卡死页面滚动的冲突
        // 如果是窄屏/移动端，禁用单指拖拽底图（dragEnable: false），用户双指才能拖拽地图。
        // 这样单指在地图上滑动时，页面可以畅快地上下正常滚动，彻底避免冲突。
        dragEnable: !isMobile, 
        keyboardEnable: false,
        doubleClickZoom: !isMobile // 手机端双击不进行地图放大，防止冲突
      });

      visualInstance = new AMap.Visual('amap://visual/415a04aa9deb44cd6c1643a3b87926e5', mapInstance);

    }).catch(e => {
      console.error("高德地图加载失败:", e);
    });

    // 针对移动端点击空白处关闭人口点阵悬浮框的监听
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

  // 人口矩阵圆点触控兼容事件
  const handleDotTouch = (e, item) => {
    e.stopPropagation(); // 阻止冒泡，防止被全局点击关闭
    const touch = e.touches[0];
    setTooltip({
      display: 'flex',
      left: touch.clientX + 10,
      top: touch.clientY - 45,
      label: item.label,
      perc: item.perc
    });
  };

  return (
    <div className="lproject1-page">
      <header className="lproject1-header">
        <div className="brand fade-text">
          <div className="blue-icon-box" onClick={() => navigate(-1)} title="Back"></div>
          <div className="title-text">
            <h1>Project</h1>
            <h2>Jinan Huangtai Central Park</h2>
          </div>
        </div>
        <div className="site-analysis fade-text">
          <div className="main">Site Analysis</div>
          <div className="sub">Interactive Interface</div>
        </div>
      </header>

      <div className="lproject1-pill-tooltip" style={{ display: tooltip.display, left: tooltip.left, top: tooltip.top }}>
        <div className="pill-row">{tooltip.label}</div>
        <div className="pill-row">{tooltip.perc}</div>
      </div>

      <div className="dashboard-container">
        <div className="side-column column-left">
          <div className="panel panel-landuse">
            <div className="panel-header fade-text">Land Use Allocation by Category</div>
            <div className="panel-body fade-text">
              <div className="land-use-list">
                {[
                  { val: 50, color: 'var(--color-yellow)', name: 'Residential' },
                  { val: 20, color: 'var(--color-green)', name: 'Parks & Green Spaces' },
                  { val: 10, color: 'var(--color-cyan)', name: 'School' },
                  { val: 15, color: 'var(--color-blue)', name: 'Commercial' },
                  { val: 5, color: '#ffffff', name: 'Other' }
                ].map((item, idx) => (
                  <div className="land-item" key={idx}>
                    <div className="progress-bar" style={{ width: `${barWidths[idx]}%` }}></div>
                    <div className="land-info">
                      <span className="perc">{item.val}%</span>
                      <span className="name">
                        <div className="land-dot" style={{ background: item.color }}></div> {item.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel panel-demographics">
            <div className="panel-header fade-text">Demographic Structure</div>
            <div className="panel-body">
              <div className="matrix-container">
                {dotSequence.map((item, index) => {
                  let row = Math.floor(index / 10);
                  let col = index % 10;
                  let delay = 1 + (row + col) * 0.05;
                  return (
                    <div
                      key={index}
                      className="m-dot"
                      style={{
                        backgroundColor: item.color,
                        animation: `lproject1-scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}s forwards`
                      }}
                      onMouseEnter={() => setTooltip({ display: 'flex', left: 0, top: 0, label: item.label, perc: item.perc })}
                      onMouseMove={(e) => setTooltip(prev => ({ ...prev, left: e.clientX + 15, top: e.clientY - 15 }))}
                      onMouseLeave={() => setTooltip(prev => ({ ...prev, display: 'none' }))}
                      // 【触控兼容】手指触摸点阵时执行单独的坐标计算并展示
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
                  <h3 className="fade-text">Climate Data</h3>
                  <div ref={chartTempRef} className="echart-dom fade-text"></div>
                </div>
                <div className="chart-unit">
                  <h3 className="fade-text">Precipitation Data</h3>
                  <div ref={chartRainRef} className="echart-dom fade-text"></div>
                </div>
                <div className="chart-unit">
                  <h3 className="fade-text">Sunshine Duration Data</h3>
                  <div ref={chartSunRef} className="echart-dom fade-text"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel panel-description">
            <div className="panel-header fade-text" style={{ marginBottom: '5px' }}>Project Description</div>
            <div className="panel-body description-box fade-text">
              <div className="description">
                This central park landscape planning and design project focuses on the urban renewal initiative in the Huangtai District of Jinan, centering on the in-depth design exploration and conceptual development of a planned central park. The project aims to improve the urban environment, establish a new city landmark, and integrate the profound historical and cultural heritage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}