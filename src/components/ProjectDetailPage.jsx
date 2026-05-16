import React, { lazy, Suspense, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './projectDetailPage.css';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // 动态懒加载对应的项目组件
  const ProjectComponent = useMemo(() => {
    if (!projectId) return null;
    return lazy(() => 
      import(`./projects/${projectId}.jsx`).catch(() => ({
        default: () => <div className="project-not-found">Project {projectId} not found</div>
      }))
    );
  }, [projectId]);

  // 如果是 LProject1 或 Project2，则彻底隐藏系统自带的默认返回按钮，改用大屏内部自带的高级小蓝块
  const showDefaultBack = projectId !== 'LProject1' && projectId !== 'Project2';

  return (
    /* 核心加固：动态为数字化大屏注入全透明专属标识类 */
    <div className={`project-detail-container ${!showDefaultBack ? 'transparent-gate' : ''}`}>
      {showDefaultBack && (
        <button 
          onClick={() => navigate(-1)} 
          className="project-back-btn"
        >
          ← Back
        </button>
      )}
      <Suspense fallback={<div className="project-loading">Loading...</div>}>
        {ProjectComponent && <ProjectComponent />}
      </Suspense>
    </div>
  );
}