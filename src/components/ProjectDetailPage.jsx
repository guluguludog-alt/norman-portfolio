import React from 'react';
import { useNavigate } from 'react-router-dom';
import './projectDetailPage.css';

export default function ProjectDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="project-detail-container">
      <button 
        onClick={() => navigate(-1)} 
        className="project-back-btn"
      >
        ← Back
      </button>
    </div>
  );
}