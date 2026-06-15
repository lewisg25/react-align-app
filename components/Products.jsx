import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/useAuth";

const planCards = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for couples starting their alignment journey.",
    price: "$0",
    cadence: "/forever",
    cta: "Start Free",
    target: "dashboard",
    features: [
      "Daily prompts (limited)",
      "Basic alignment insights",
      "Partner linking",
      "Weekly check-ins",
      "Community access",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "For couples serious about deepening their connection.",
    price: "$12",
    cadence: "/per month",
    cta: "Explore Programs",
    target: "programs",
    isFeatured: true,
    features: [
      "Unlimited daily prompts",
      "Advanced alignment analytics",
      "Priority partner matching",
      "Personalized programs",
      "1:1 coaching sessions",
      "Exclusive content library",
      "Early access to features",
    ],
  },
];

const missionCards = [
  {
    icon: "fa-crosshairs",
    title: "Who ALIGN is For",
    copy: "ALIGN is designed for couples at any stage—newlyweds, long-term partners, or those working to reconnect. Whether you're thriving or facing challenges, we're here to help.",
  },
  {
    icon: "fa-heart",
    title: "Why Mental & Emotional Alignment",
    copy: "True connection goes beyond the surface. When partners understand each other's thoughts, feelings, and needs, they build a foundation that can weather any storm.",
  },
  {
    icon: "fa-venus-mars",
    title: "Built by Experts",
    copy: "Our programs are developed with relationship therapists, psychologists, and couples who've walked the path. Every prompt is crafted with intention.",
  },
  {
    icon: "fa-fingerprint",
    title: "Your Privacy Matters",
    copy: "Your conversations and data are sacred. We use bank-level encryption and never share your personal information. Your journey is yours alone.",
  },
];

function PricingCard({ plan, onChoose }) {
  return (
    <article
      className={plan.isFeatured ? "pricing-card premium" : "pricing-card"}
    >
      {plan.isFeatured && <div className="badge">Most Popular</div>}
      <div className="card-top">
        <h3>{plan.name}</h3>
        <div className="price">
          {plan.price}
          <span>{plan.cadence}</span>
        </div>
        <p>{plan.description}</p>
      </div>
      <ul className="features-list">
        {plan.features.map((feature) => (
          <li key={feature}>
            <span>
              <i className="fa-solid fa-check" />
            </span>{" "}
            {feature}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={plan.isFeatured ? "btn-solid" : "btn-outline"}
        onClick={() => onChoose(plan)}
      >
        {plan.cta}
      </button>
    </article>
  );
}

function MissionCard({ icon, title, copy }) {
  return (
    <article className="mission-card">
      <div className="card-icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

const Products = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleChoosePlan = (plan) => {
    if (plan.target === "dashboard") {
      navigate(isAuthenticated ? "/dashboard" : "/login?redirect=/dashboard");
      return;
    }

    navigate(`/${plan.target}`);
  };

  return (
    <main>
      <section className="pricing-section">
        <div className="pricing-header">
          <h1>
            Choose Your <span>Plan</span>
          </h1>
          <p>
            Find the perfect plan for your relationship journey. All plans
            include our core features.
          </p>
        </div>

        <div className="pricing-grid">
        {planCards.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onChoose={handleChoosePlan}
            />
          ))}
        </div>
      </section>

      <section className="our-mission">
        <div className="mission-header">
          <span className="mission-icon">
            <i className="fa-solid fa-burst" />
          </span>
          <h2>Our Mission & Philosophy</h2>
        </div>
        <div className="mission-grid">
          {missionCards.map((card) => (
            <MissionCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Products;
