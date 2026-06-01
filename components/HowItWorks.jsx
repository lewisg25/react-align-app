import React from "react";

const HowItWorks = () => {
    return (
        <>
     <main>
<section className="how-works">
  <div className="how-works-header">
    <h1>How <span>ALIGN</span> Works</h1>
    <p>A simple yet powerful process to strengthen your relationship through understanding and communication.</p>
  </div>

  <div className="steps-container">
    <div className="step-item">
     
      <div className="step-card">
        <div className="icon-box"><i className="fa-solid fa-question"></i></div>
        <div className="step-text">
          <h3>Answer Together</h3>
          <p>Start with thought-provoking questions designed by relationship experts. Take turns answering and
            listening.</p>
        </div>
      </div>
    </div>

    <div className="step-item">
      <div className="step-card">
        <div className="icon-box"><i className="fa-solid fa-crosshairs"></i></div>
        <div className="step-text">
          <h3>Discover Alignment Gaps</h3>
          <p>Our system analyzes your responses to identify areas where your perspectives differ or need
            attention.</p>
        </div>
      </div>
    </div>

    <div className="step-item">
      <div className="step-card">
        <div className="icon-box"><i className="fa-solid fa-calendar-check"></i></div>
        <div className="step-text">
          <h3>Daily & Weekly Prompts</h3>
          <p>Receive personalized prompts based on your alignment gaps. Check in daily or weekly at your own pace.
          </p>
        </div>
      </div>
    </div>

    <div className="step-item">
      
      <div className="step-card">
        <div className="icon-box"><i className="fa-solid fa-circle-check"></i></div>
        <div className="step-text">
          <h3>Emotional Check-ins</h3>
          <p>Track your emotional wellness journey together. See your progress and celebrate your growth as a
            couple.</p>
        </div>
      </div>
    </div>
  </div>
</section>
</main>   
        </>
    );
}

export default HowItWorks; 
