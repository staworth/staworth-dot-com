import React from "react";

interface PageSummaryProps {
  title: string;
  description: string;
  style?: React.CSSProperties;
}

const PageSummary: React.FC<PageSummaryProps> = ({ title, description, style }) => {
  return (
    <div
      className="page-summary"
      style={style}
    >
      <p className="page-summary-title">{title}</p>
      <p>{description}</p>
    </div>
  );
};

export default PageSummary;