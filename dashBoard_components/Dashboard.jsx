import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReflectionScreen from "./ReflectionScreen";
import {
  clearAuth,
  getCheckInQuestions,
  getDashboard,
  getStoredAuth,
  getWeeklySummary,
  saveCheckInResponse,
} from "../src/api";
///Time and Date///////////////////////////////////
function getCurrentWeekIdentifier() {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNumber = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

function formatLocalDashboardTime(date) {
  return {
    date: new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date),
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date),
  };
}
/// Time and Date////////////////////////////////////
const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [localNow, setLocalNow] = useState(() => new Date());
  const [error, setError] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const weekIdentifier = useMemo(() => getCurrentWeekIdentifier(), []);
  const localDateTime = useMemo(() => formatLocalDashboardTime(localNow), [localNow]);
  const navigate = useNavigate();
  const storedUser = getStoredAuth()?.user;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [dashboardData, questionsData, summaryData] = await Promise.all([
          getDashboard(),
          getCheckInQuestions(),
          getWeeklySummary(weekIdentifier),
        ]);

        if (isMounted) {
          setDashboard(dashboardData);
          setQuestionData(questionsData);
          setSummary(summaryData);
          setStreak({
            currentStreak: dashboardData.user?.currentStreak || 0,
            longestStreak: dashboardData.user?.longestStreak || 0,
          });
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoadingQuestions(false);
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [weekIdentifier]);

  const user = dashboard?.user || storedUser;
  const firstName = user?.firstName || "there";
  const questions = questionData?.questions || [];
  const selectedQuestion = questions[0];
  const answeredToday = Boolean(questionData?.answeredToday);
  const tierLabel = {
    '1-3_years': '1-3 years together',
    '5-7_years': '5-7 years together',
    other: `${questionData?.yearsTogether ?? user?.yearsTogether ?? 0} years together`,
  }[questionData?.relationshipTier || user?.relationshipTier || 'other'];

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleSaveResponse = async (response) => {
    const saveResult = await saveCheckInResponse({
      ...response,
      weekIdentifier,
    });
    if (saveResult.streak) setStreak(saveResult.streak);
    const summaryData = await getWeeklySummary(weekIdentifier);
    setQuestionData((currentData) => currentData ? {
      ...currentData,
      answeredToday: true,
      message: "You already completed today’s check-in. Come back tomorrow for your next question.",
    } : currentData);
    setSummary(summaryData);
    return saveResult;
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-topbar">
        <div>
          <p className="dashboard-kicker">Your dashboard</p>
          <h1 className="dashboard-welcome">Welcome, {firstName}</h1>
        </div>
        <div className="dashboard-actions">
          <div className="local-time-card" aria-live="polite">
            <p className="dashboard-kicker">Local time</p>
            <strong>{localDateTime.time}</strong>
            <span>{localDateTime.date}</span>
          </div>
          <button type="button" className="btn-solid dashboard-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </section>

      <section className="streak-strip">
        <div>
          <p className="dashboard-kicker">Daily streak</p>
          <strong>{streak?.currentStreak || 0} day{(streak?.currentStreak || 0) === 1 ? "" : "s"}</strong>
        </div>
        <div>
          <p className="dashboard-kicker">Best streak</p>
          <strong>{streak?.longestStreak || 0} day{(streak?.longestStreak || 0) === 1 ? "" : "s"}</strong>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="dashboard-content">
        <div className="question-panel">
          <div>
            <p className="dashboard-kicker">Questions for your relationship stage</p>
            <h2 className="dashboard-section-title">{tierLabel}</h2>
          </div>

          {isLoadingQuestions && <p className="product-status">Loading your questions...</p>}

          {!isLoadingQuestions && questions.length > 0 && (
            <p className={answeredToday ? "daily-status complete" : "daily-status"}>
              {answeredToday ? "Today’s check-in is complete." : "Today’s question is ready."}
            </p>
          )}

          {!isLoadingQuestions && !questions.length && (
            <p className="product-status">No questions are available yet for this stage.</p>
          )}
        </div>

        <ReflectionScreen
          key={selectedQuestion?._id || selectedQuestion?.questionId || selectedQuestion?.text || "daily-question"}
          question={selectedQuestion}
          onSave={handleSaveResponse}
          isLocked={answeredToday}
          lockedMessage={questionData?.message}
        />

        <section className="weekly-summary">
          <p className="dashboard-kicker">Weekly Summary</p>
          <h2 className="dashboard-section-title">What you learned this week</h2>
          <p className="product-status">{summary?.message || "Save responses to build your weekly summary."}</p>

          {summary?.insights?.length > 0 && (
            <div className="insight-list">
              {summary.insights.map((insight) => (
                <article className="insight-item" key={`${insight.questionText}-${insight.answeredAt}`}>
                  <p className="dashboard-kicker">{insight.category}</p>
                  <h3>{insight.questionText}</h3>
                  <p>{insight.learned}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
