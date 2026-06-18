import { motion as Motion } from "framer-motion";
import { fadeUp, popIn, stagger, useScrollReveal } from "../src/scrollMotion";

const reviewProfiles = [
  {
    names: "Maya & Jordan",
    stage: "Married 2 years",
    answered: 18,
    quote:
      "The questions helped us name what was actually going on instead of circling the same argument.",
    takeaway: "Started a weekly planning ritual",
    scores: [
      { label: "Communication", value: 84 },
      { label: "Connection", value: 79 },
      { label: "Future Planning", value: 71 },
    ],
  },
  {
    names: "Priya & Sam",
    stage: "Together 6 years",
    answered: 31,
    quote:
      "Seeing our results side by side made the conversation feel calmer and more specific.",
    takeaway: "Rebuilt their check-in habit",
    scores: [
      { label: "Trust", value: 88 },
      { label: "Communication", value: 76 },
      { label: "Emotional Safety", value: 82 },
    ],
  },
  {
    names: "Elena & Marcus",
    stage: "New parents",
    answered: 24,
    quote:
      "ALIGN gave us a small pause in the week where we could talk without making it a huge thing.",
    takeaway: "Found clearer household rhythms",
    scores: [
      { label: "Support", value: 73 },
      { label: "Connection", value: 81 },
      { label: "Shared Load", value: 69 },
    ],
  },
  {
    names: "Noah & Avery",
    stage: "Engaged",
    answered: 14,
    quote:
      "The prompts brought up future topics we knew mattered but had not made space for yet.",
    takeaway: "Aligned on wedding-season stress",
    scores: [
      { label: "Future Planning", value: 86 },
      { label: "Conflict Repair", value: 74 },
      { label: "Values", value: 90 },
    ],
  },
  {
    names: "Talia & Renee",
    stage: "Together 9 years",
    answered: 42,
    quote:
      "We stopped guessing what the other person needed and started using the answers as a calmer starting point.",
    takeaway: "Made repair conversations easier",
    scores: [
      { label: "Emotional Safety", value: 91 },
      { label: "Repair", value: 83 },
      { label: "Shared Goals", value: 78 },
    ],
  },
  {
    names: "Chris & Morgan",
    stage: "Married 11 years",
    answered: 36,
    quote:
      "The weekly results helped us notice the small wins we usually skipped over during busy seasons.",
    takeaway: "Protected a Sunday check-in",
    scores: [
      { label: "Connection", value: 87 },
      { label: "Appreciation", value: 92 },
      { label: "Conflict Repair", value: 80 },
    ],
  },
  {
    names: "Imani & Lucas",
    stage: "Long distance",
    answered: 27,
    quote:
      "It gave our video calls more direction without making them feel like another task on the calendar.",
    takeaway: "Built better distance rituals",
    scores: [
      { label: "Communication", value: 89 },
      { label: "Consistency", value: 85 },
      { label: "Trust", value: 81 },
    ],
  },
  {
    names: "Serena & Kai",
    stage: "Blended family",
    answered: 33,
    quote:
      "The results helped us talk about parenting pressure without turning it into blame.",
    takeaway: "Created a calmer family rhythm",
    scores: [
      { label: "Support", value: 86 },
      { label: "Teamwork", value: 88 },
      { label: "Emotional Safety", value: 84 },
    ],
  },
];

function ScoreBar({ label, value }) {
  return (
    <div className="review-score">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="review-meter" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ReviewCard({ profile }) {
  const initials = profile.names
    .split("&")
    .map((name) => name.trim()[0])
    .join("");

  return (
    <Motion.article className="review-card" variants={popIn} tabIndex={0}>
      <div className="review-card-inner">
        <div className="review-card-face review-card-front">
          <div className="review-card-top">
            <div className="review-avatar" aria-hidden="true">
              {initials}
            </div>
            <div>
              <h2>{profile.names}</h2>
              <p>{profile.stage}</p>
            </div>
          </div>
          <p className="review-quote">"{profile.quote}"</p>
          <div className="review-meta">
            <span>
              <i className="fa-solid fa-circle-check" /> {profile.answered}{" "}
              answered questions
            </span>
            <span>{profile.takeaway}</span>
          </div>
        </div>

        <div className="review-card-face review-card-back">
          <div>
            <p className="reviews-kicker">Result profile</p>
            <h3>{profile.names}</h3>
            <p className="review-back-copy">
              Based on {profile.answered} answered questions.
            </p>
          </div>
          <div className="review-scores">
            {profile.scores.map((score) => (
              <ScoreBar key={score.label} {...score} />
            ))}
          </div>
        </div>
      </div>
    </Motion.article>
  );
}

const Reviews = () => {
  const reveal = useScrollReveal(0.12);

  return (
    <Motion.main className="reviews-page" variants={stagger} {...reveal}>
      <Motion.section className="reviews-hero" variants={fadeUp}>
        <p className="reviews-kicker">Real alignment snapshots</p>
        <h1>Reviews from couples using ALIGN</h1>
        <p>
          A few different examples of couples answering questions, comparing
          results, and turning their scores into better conversations.
        </p>
      </Motion.section>

      <Motion.section
        className="reviews-grid"
        variants={stagger}
        aria-label="Couple review profiles"
      >
        {reviewProfiles.map((profile) => (
          <ReviewCard key={profile.names} profile={profile} />
        ))}
      </Motion.section>
    </Motion.main>
  );
};

export default Reviews;
