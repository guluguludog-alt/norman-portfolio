import React, { useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './projectDetailPage.css';

// 使用 React.lazy 动态加载每个项目的组件
// 这样只有在用户进入对应项目时，才会加载它复杂的代码和库，保证画廊的极速性能
const Project1 = React.lazy(() => import('./projects/Project1'));
const Project2 = React.lazy(() => import('./projects/Project2'));
const Project3 = React.lazy(() => import('./projects/Project3'));
const Project4 = React.lazy(() => import('./projects/Project4'));
const Project5 = React.lazy(() => import('./projects/Project5'));

const LProject1 = React.lazy(() => import('./projects/LProject1'));
const LProject2 = React.lazy(() => import('./projects/LProject2'));
const LProject3 = React.lazy(() => import('./projects/LProject3'));
const LProject4 = React.lazy(() => import('./projects/LProject4'));
const LProject5 = React.lazy(() => import('./projects/LProject5'));

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // 每次进入详情页时，自动回到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  // 根据路由参数渲染对应的复杂设计组件
  const renderProjectContent = () => {
    switch (projectId) {
      case 'Project1': return <Project1 />;
      case 'Project2': return <Project2 />;
      case 'Project3': return <Project3 />;
      case 'Project4': return <Project4 />;
      case 'Project5': return <Project5 />;
      case 'LProject1': return <LProject1 />;
      case 'LProject2': return <LProject2 />;
      case 'LProject3': return <LProject3 />;
      case 'LProject4': return <LProject4 />;
      case 'LProject5': return <LProject5 />;
      default: 
        return (
          <div className="project-not-found">
            <h1>{projectId}</h1>
            <p style={{ marginTop: '20px', opacity: 0.6 }}>The complex design for this project will be deployed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="project-detail-container">
      {/* 悬浮的返回按钮，带有一点玻璃拟态效果 */}
      <button 
        onClick={() => navigate(-1)} 
        className="project-back-btn"
      >
        ← Back
      </button>
      
      {/* 项目主内容容器 */}
      <div className="project-content-wrapper">
        <Suspense fallback={<div className="project-loading">Loading project assets...</div>}>
          {renderProjectContent()}
        </Suspense>
      </div>
    </div>
  );
}
