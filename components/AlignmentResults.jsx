import { useEffect, useMemo, useState } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { getResponses } from "../src/api";
import { buildAlignmentResults, scoreFromMoodScale } from "../src/alignmentResults";

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const gridFlow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function ResultCard({ item }) {
  return (
    <Motion.article className="result-gap-card" variants={fadeUp}>
      <div className="result-gap-header">
        <h3>{item.category}</h3>
        <strong>{item.percent}%</strong>
      </div>
      <div className="result-meter" aria-hidden="true">
        <Motion.span
          style={{ width: `${item.percent}%` }}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      </div>
      <p>{item.description}</p>
      <span className="result-count">
        {item.responseCount ? `${item.responseCount} saved response${item.responseCount === 1 ? "" : "s"}` : "Building from seed category"}
      </span>
    </Motion.article>
  );
}

const responseId = (response) => response?._id || response?.id || response?.responseId;

const mergeResponses = (responses, latestResponse) => {
  if (!latestResponse) return responses;
  const latestId = responseId(latestResponse);
  const exists = latestId && responses.some((response) => responseId(response) === latestId);
  return exists ? responses : [latestResponse, ...responses];
};

const AlignmentResults = () => {
  const { state } = useLocation();
  const latestResponse = state?.savedResponse || null;
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("Loading alignment results...");
  const shouldReduceMotion = useReducedMotion();
  const resultResponses = useMemo(
    () => mergeResponses(responses, latestResponse),
    [responses, latestResponse]
  );
  const results = useMemo(() => buildAlignmentResults(resultResponses), [resultResponses]);
  const topCategories = [...results.categories]
    .sort((first, second) => second.percent - first.percent)
    .slice(0, 6);

  useEffect(() => {
    let isMounted = true;
    getResponses()
      .then((data) => {
        if (!isMounted) return;
        setResponses(data?.responses || []);
        setStatus("");
      })
      .catch((error) => {
        if (isMounted) setStatus(error.message || "Could not load results.");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Motion.main
      className="results-shell"
      initial={shouldReduceMotion ? false : "hidden"}
      animate="show"
      transition={{ staggerChildren: 0.08 }}
    >
      <Motion.section className="results-header" variants={fadeUp}>
        <div>
          <p className="results-kicker">Couples Alignment</p>
          <h1 className="results-title">Your alignment results</h1>
          <p className="results-summary">
            These percentages are grouped by the same relationship categories
            seeded in your ALIGN backend and become more personalized as more
            questionnaire responses are saved.
          </p>
          <div className="results-save-row">
            <Link className="btn-submit" to="/dashboard">
              Back to Dashboard
            </Link>
            {status && <p className="results-save-status">{status}</p>}
          </div>
        </div>

        <aside className="result-score-card" aria-label="Overall alignment">
          <Motion.div
            className="score-ring"
            style={{ "--score": shouldReduceMotion ? results.overall : 0 }}
            animate={{ "--score": results.overall }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span>{results.overall}%</span>
          </Motion.div>
          <p>Overall alignment</p>
        </aside>
      </Motion.section>

      {latestResponse && (
        <Motion.section className="latest-result-card" variants={fadeUp}>
          <div>
            <p className="results-kicker">Latest Response</p>
            <h2>{latestResponse.category || "Connection"}</h2>
            <p>{latestResponse.questionText}</p>
          </div>
          <strong>{scoreFromMoodScale(latestResponse.moodScale)}%</strong>
        </Motion.section>
      )}

      <Motion.section className="results-section" variants={fadeUp}>
        <div className="results-section-heading">
          <p className="results-kicker">Seed Categories</p>
          <h2>Where you are strongest right now</h2>
        </div>
        <Motion.div className="result-gap-grid" variants={gridFlow}>
          {topCategories.map((item) => (
            <ResultCard item={item} key={item.category} />
          ))}
        </Motion.div>
      </Motion.section>
    </Motion.main>
  );
};

export default AlignmentResults;
