const steps = [
  {
    icon: "fa-question",
    title: "Answer Together",
    copy: "Start with thought-provoking questions designed by relationship experts. Take turns answering and listening.",
  },
  {
    icon: "fa-crosshairs",
    title: "Discover Alignment Gaps",
    copy: "Our system analyzes your responses to identify areas where your perspectives differ or need attention.",
  },
  {
    icon: "fa-calendar-check",
    title: "Daily & Weekly Prompts",
    copy: "Receive personalized prompts based on your alignment gaps. Check in daily or weekly at your own pace.",
  },
  {
    icon: "fa-circle-check",
    title: "Emotional Check-ins",
    copy: "Track your emotional wellness journey together. See your progress and celebrate your growth as a couple.",
  },
];

const HowItWorks = () => (
  <main>
    <section className="how-works">
      <div className="how-works-header">
        <h1>
          How <span>ALIGN</span> Works
        </h1>
        <p>
          A simple yet powerful process to strengthen your relationship through
          understanding and communication.
        </p>
      </div>

      <div className="steps-container">
        {steps.map(({ icon, title, copy }) => (
          <div className="step-item" key={title}>
            <div className="step-card">
              <div className="icon-box">
                <i className={`fa-solid ${icon}`} />
              </div>
              <div className="step-text">
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default HowItWorks;
