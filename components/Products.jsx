import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createCheckoutSession, getStoredAuth, getStripeProducts } from "../src/api";

const fallbackProducts = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for couples starting their alignment journey.",
    priceId: null,
    unitAmount: 0,
    currency: "usd",
    recurringInterval: null,
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
    priceId: null,
    unitAmount: 1200,
    currency: "usd",
    recurringInterval: "month",
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

function formatPrice(product) {
  if (!product.unitAmount) return "$0";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "usd",
    maximumFractionDigits: 0,
  }).format(product.unitAmount / 100);

  return formatted;
}

const Products = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutPriceId, setCheckoutPriceId] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await getStripeProducts();
        if (isMounted && data.products?.length) {
          setProducts(data.products);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const productMap = useMemo(
    () => ({
      free: products.find((product) => product.id === "free") || fallbackProducts[0],
      premium:
        products.find((product) => product.name?.toLowerCase() === "premium") ||
        products.find((product) => product.id === "premium") ||
        fallbackProducts[1],
    }),
    [products]
  );

  const handleStartFree = () => {
    navigate(getStoredAuth()?.token ? "/dashboard" : "/login");
  };

  const handleGoPremium = async () => {
    const auth = getStoredAuth();

    if (!auth?.token) {
      navigate("/login");
      return;
    }

    if (!productMap.premium.priceId) {
      setError("Premium checkout is not configured yet.");
      return;
    }

    setError("");
    setCheckoutPriceId(productMap.premium.priceId);

    try {
      const { url } = await createCheckoutSession({
        priceId: productMap.premium.priceId,
      });
      window.location.assign(url);
    } catch (err) {
      setError(err.message);
      setCheckoutPriceId("");
    }
  };

  return (
    <>
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
            {searchParams.get("payment") === "cancelled" && (
              <p className="product-status">Checkout cancelled. You can try again anytime.</p>
            )}
            {error && <p className="error-message">{error}</p>}
            {isLoading && <p className="product-status">Loading plans...</p>}
          </div>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="card-top">
                <h3>{productMap.free.name}</h3>
                <div className="price">
                  {formatPrice(productMap.free)}<span>/forever</span>
                </div>
                <p>{productMap.free.description}</p>
              </div>
              <ul className="features-list">
                {productMap.free.features.map((feature) => (
                  <li key={feature}>
                    <span>
                      <i className="fa-solid fa-check"></i>
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-outline" onClick={handleStartFree}>Start Free</button>
            </div>

            <div className="pricing-card premium">
              <div className="badge">Most Popular</div>
              <div className="card-top">
                <h3>{productMap.premium.name}</h3>
                <div className="price">
                  {formatPrice(productMap.premium)}
                  <span>
                    {productMap.premium.recurringInterval
                      ? `/per ${productMap.premium.recurringInterval}`
                      : ""}
                  </span>
                </div>
                <p>{productMap.premium.description}</p>
              </div>
              <ul className="features-list">
                {productMap.premium.features.map((feature) => (
                  <li key={feature}>
                    <span>
                      <i className="fa-solid fa-check"></i>
                    </span>{" "}
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="btn-solid"
                onClick={handleGoPremium}
                disabled={checkoutPriceId === productMap.premium.priceId}
              >
                {checkoutPriceId === productMap.premium.priceId ? "Opening Stripe..." : "Go Premium"}
              </button>
            </div>
          </div>
        </section>
        <section className="our-mission">
          <div className="mission-header">
            <span className="mission-icon">
              <i className="fa-solid fa-burst"></i>
            </span>
            <h2>Our Mission & Philosophy</h2>
          </div>

          <div className="mission-grid">
            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-crosshairs"></i>
              </div>
              <h3>Who ALIGN is For</h3>
              <p>
                ALIGN is designed for couples at any stage—newlyweds, long-term
                partners, or those working to reconnect. Whether you're thriving
                or facing challenges, we're here to help.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h3>Why Mental & Emotional Alignment</h3>
              <p>
                True connection goes beyond the surface. When partners
                understand each other's thoughts, feelings, and needs, they
                build a foundation that can weather any storm.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-venus-mars"></i>
              </div>
              <h3>Built by Experts</h3>
              <p>
                Our programs are developed with relationship therapists,
                psychologists, and couples who've walked the path. Every prompt
                is crafted with intention.
              </p>
            </div>

            <div className="mission-card">
              <div className="card-icon">
                <i className="fa-solid fa-fingerprint"></i>
              </div>
              <h3>Your Privacy Matters</h3>
              <p>
                Your conversations and data are sacred. We use bank-level
                encryption and never share your personal information. Your
                journey is yours alone.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Products;
