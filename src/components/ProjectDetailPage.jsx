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

  // 核心：如果是 LProject1 (济南黄台中央公园)，则隐藏默认的返回按钮，改用它专属的左上角小蓝块
  const showDefaultBack = projectId !== 'LProject1';

  return (
    <div className="project-detail-container">
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