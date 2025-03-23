import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PlanDisplay.css';

function PlanDisplay({ plan }) {
  return (
    <div className="plan-result">
      <h3>Your Personalized Diet Plan</h3>
      {/* 
        Using ReactMarkdown to parse any headings, bullet points, etc.
        'remarkPlugins={[remarkGfm]}' supports GitHub Flavored Markdown syntax 
      */}
      <div className="plan-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {plan}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default PlanDisplay;
