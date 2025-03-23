import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './PlanDisplay.css';

function PlanDisplay({ plan }) {
  // Function to enhance the plan with additional formatting
  const enhancePlan = (planText) => {
    // If plan is empty, return as is
    if (!planText) return planText;
    
    // Replace standard meal section headers with styled ones
    let enhancedPlan = planText
      // Format main meal sections (I., II., etc.)
      .replace(/^(I+V?\. .+)$/gm, '# $1')
      // Format meal options
      .replace(/^(Option \d+:)/gm, '### $1')
      // Format nutrition data with code blocks
      .replace(/^(Calories:.+)$/gm, '```\n$1\n```')
      .replace(/^(Protein:.+)$/gm, '```\n$1\n```')
      .replace(/^(Carbs:.+)$/gm, '```\n$1\n```')
      .replace(/^(Fat:.+)$/gm, '```\n$1\n```')
      // Group nutrition info and add separator after each option
      .replace(/```\n(Calories:.+)\n```\s*```\n(Protein:.+)\n```\s*```\n(Carbs:.+)\n```\s*```\n(Fat:.+)\n```/gm, 
        '<div class="nutrition-info">\n$1\n$2\n$3\n$4\n</div>\n\n---');
        console.log(planText);
      
    return enhancedPlan;
  };

  // Apply custom renderers for React Markdown
  const renderers = {
    // Wrap each main meal section in a div with specific styling
    h1: ({node, ...props}) => (
      <div className="plan-section">
        <h1 {...props} />
        {props.children}
      </div>
    )
  };

  return (
    <div className="plan-result">
      <h3>Your Personalized Diet Plan</h3>
      <div className="plan-content">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={renderers}
        >
          {enhancePlan(plan)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default PlanDisplay;