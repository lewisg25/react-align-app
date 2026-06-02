import { useState } from "react";

const ActionFooter = ()=> {
  const [shareImmediately, setShareImmediately] = useState(true);

  return (

    <>
     <footer className="footer-container">

      <div className="share-toggle-row">
        <div className="share-text-container">
          <span className="share-title">Share immediately</span>
          <span className="share-subtitle">Toggle off to save for Weekly Reveal</span>
        </div>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={shareImmediately} 
            onChange={() => setShareImmediately(!shareImmediately)} 
          />
          <span className="slider"></span>
        </label>
      </div>


      <nav className="nav-bar">
        <button className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className="nav-item active">
          <div className="nav-icon-wrapper">
            <span className="nav-icon">📖</span>
          </div>
          <span>Journey</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Insights</span>
        </button>
        <button className="nav-item">
          <span className="nav-icon">👤</span>
          <span>Profile</span>
        </button>
      </nav>
    </footer>
    </>
   
  );
}

export default ActionFooter;