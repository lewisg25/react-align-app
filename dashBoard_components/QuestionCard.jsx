import React from "react";

function QuestionCard() {
    return (
      <div className="reflection-card">
        {/* Floating accent leaf in the top-right corner */}
        <span className="card-leaf-icon">🍃</span>
        
        {/* Center circle badge/icon */}
        <div className="card-badge-wrapper">
          <div className="card-badge">
            <span className="badge-icon">❓</span>
          </div>
        </div>
        
        {/* Main bold prompt question */}
        <h2 className="card-question">
          If you could relive one memory with your partner today, which would it be and why?
        </h2>
        
        {/* Sub-text breath/focus cue */}
        <p className="card-prompt">
          Take a deep breath. Focus on a moment that brings you quiet joy.
        </p>
      </div>
    );
  }
  
  export default QuestionCard;