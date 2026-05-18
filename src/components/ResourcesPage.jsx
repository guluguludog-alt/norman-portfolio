import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import "./resourcesPage.css";
import clipoIcon from "../assets/Clipoicon.png";

function ResourcesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const softwareList = [
    {
      key: "clipo",
      icon: clipoIcon,
    },
  ];

  const handleGoHome = () => {
    setIsExiting(true);
  };

  return (
    <motion.div
      className="resources-page"
      initial={{ y: "-100%" }}
      animate={isExiting ? { y: "-100%" } : { y: "0%" }}
      transition={{
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1],
      }}
      onAnimationComplete={() => {
        if (isExiting) {
          navigate("/");
        }
      }}
    >
      {/* Home button */}
      <button className="resources-home-btn" onClick={handleGoHome}>
        <svg
          className="resources-home-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>{t("resources.home")}</span>
      </button>

      {/* Title - centered at top */}
      <h1 className="resources-title">{t("resources.title")}</h1>

      {/* Disclaimer */}
      <p className="resources-disclaimer">{t("resources.disclaimer")}</p>

      {/* Divider */}
      <div className="resources-divider"></div>

      {/* Software list */}
      <div className="resources-list">
        {softwareList.map((item) => (
          <div className="resources-card" key={item.key}>
            <div className="resources-card-left">
              <h2 className="resources-card-title">
                {t(`resources.${item.key}.name`)}
              </h2>
              <p className="resources-card-desc">
                {t(`resources.${item.key}.description`)}
              </p>
              <div className="resources-card-buttons">
                <button className="resources-btn resources-btn-learn">
                  {t("resources.learnMore")}
                </button>
                <button className="resources-btn resources-btn-download">
                  {t("resources.download")}
                </button>
              </div>
            </div>
            <div className="resources-card-right">
              <img
                src={item.icon}
                alt={t(`resources.${item.key}.name`)}
                className="resources-card-icon"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ResourcesPage;