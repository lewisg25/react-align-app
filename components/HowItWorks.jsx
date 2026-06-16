import { motion as Motion } from "framer-motion";
import { fadeUp, popIn, stagger, useScrollReveal } from "../src/scrollMotion";

const stepCards = [
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

const HowItWorks = () => {
  const reveal = useScrollReveal();

  return (
    <main>
      <Motion.section className="how-works" variants={stagger} {...reveal}>
        <Motion.div className="how-works-header" variants={fadeUp}>
          <h1>
            How <span>ALIGN</span> Works
          </h1>
          <p>
            A simple yet powerful process to strengthen your relationship through
            understanding and communication.
          </p>
        </Motion.div>

        <Motion.div className="steps-container" variants={stagger}>
          {stepCards.map(({ icon, title, copy }) => (
            <Motion.div className="step-item" key={title} variants={popIn}>
              <div className="step-card">
                <div className="icon-box">
                  <i className={`fa-solid ${icon}`} />
                </div>
                <div className="step-text">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </Motion.section>
    </main>
  );
};

export default HowItWorks;
