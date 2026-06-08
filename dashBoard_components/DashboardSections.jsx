import {
  formatQuestionOption,
  formatResponseDate,
  getQuestionKey,
} from "./dashboardHelpers";

const pluralDays = (days) => `${days} day${days === 1 ? "" : "s"}`;
const activeClass = (isActive, base) => (isActive ? `${base} active` : base);

function StatCard({ label, value }) {
  return (
    <div>
      <p className="dashboard-kicker">{label}</p>
      <strong>{pluralDays(value || 0)}</strong>
    </div>
  );
}

function QuestionOption({ isSelected, onSelect, question }) {
  return (
    <button
      type="button"
      className={activeClass(isSelected, "question-option")}
      key={getQuestionKey(question)}
      onClick={() => onSelect(getQuestionKey(question))}
      aria-label={formatQuestionOption(question)}
    >
      <span className="question-option-number">{question.questionId}</span>
      <span className="question-option-text">{question.text}</span>
    </button>
  );
}

function InsightList({ insights = [] }) {
  if (!insights.length) return null;
  return (
    <div className="insight-list">
      {insights.map((insight) => (
        <article
          className="insight-item"
          key={`${insight.questionText}-${insight.answeredAt}`}
        >
          <p className="dashboard-kicker">{insight.category}</p>
          <h3>{insight.questionText}</h3>
          <p>{insight.learned}</p>
        </article>
      ))}
    </div>
  );
}

export function DashboardTopbar({
  firstName,
  localDateTime,
  marriageYearsLabel,
  onLogout,
}) {
  return (
    <section className="dashboard-topbar">
      <div>
        <h1 className="dashboard-welcome">Welcome, {firstName}</h1>
      </div>
      <div className="dashboard-actions">
        <div className="dashboard-info-card">
          <p className="dashboard-kicker">Married</p>
          <strong>{marriageYearsLabel}</strong>
        </div>
        <div className="local-time-card" aria-live="polite">
          <p className="dashboard-kicker">Local time</p>
          <strong>{localDateTime.time}</strong>
          <span>{localDateTime.date}</span>
        </div>
        <button
          type="button"
          className="btn-solid dashboard-logout"
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </section>
  );
}

export function StreakStrip({ streak }) {
  return (
    <section className="streak-strip">
      <StatCard label="Daily streak" value={streak?.currentStreak} />
      <StatCard label="Best streak" value={streak?.longestStreak} />
    </section>
  );
}

export function QuestionPanel({
  answeredToday,
  isLoadingQuestions,
  questions,
  tierLabel,
}) {
  const status = answeredToday
    ? "A response is saved for today."
    : "Today’s questions are ready.";
  return (
    <div className="question-panel">
      <div>
        <p className="dashboard-kicker">
          Questions for your relationship stage
        </p>
        <h2 className="dashboard-section-title">{tierLabel}</h2>
      </div>
      {isLoadingQuestions && (
        <p className="product-status">Loading your questions...</p>
      )}
      {!isLoadingQuestions && questions.length > 0 && (
        <p className={answeredToday ? "daily-status complete" : "daily-status"}>
          {status}
        </p>
      )}
      {!isLoadingQuestions && !questions.length && (
        <p className="product-status">
          No questions are available yet for this stage.
        </p>
      )}
    </div>
  );
}

export function QuestionPicker({
  onQuestionSelect,
  questions,
  selectedQuestion,
}) {
  if (!questions.length) return null;
  return (
    <section className="question-picker">
      <label htmlFor="question-select">Question</label>
      <select
        id="question-select"
        className="question-select"
        value={getQuestionKey(selectedQuestion)}
        onChange={(event) => onQuestionSelect(event.target.value)}
      >
        {questions.map((question) => (
          <option
            value={getQuestionKey(question)}
            key={getQuestionKey(question)}
          >
            {formatQuestionOption(question)}
          </option>
        ))}
      </select>
      <div className="question-list" aria-label="Available questions">
        {questions.map((question) => (
          <QuestionOption
            question={question}
            isSelected={
              getQuestionKey(question) === getQuestionKey(selectedQuestion)
            }
            onSelect={onQuestionSelect}
            key={getQuestionKey(question)}
          />
        ))}
      </div>
    </section>
  );
}

export function ResponseHistoryPanel({
  onSelectResponseDate,
  savedResponses,
  selectedResponseDate,
  todayIdentifier,
}) {
  if (!savedResponses.length) return null;
  return (
    <section className="response-history-panel">
      <div className="saved-response-list" aria-label="Saved responses">
        {savedResponses.map((response) => (
          <button
            type="button"
            className={activeClass(
              response.responseDate === selectedResponseDate,
              "saved-response-chip"
            )}
            key={response.id}
            onClick={() =>
              onSelectResponseDate(response.responseDate || todayIdentifier)
            }
          >
            {formatResponseDate(response.responseDate)}
          </button>
        ))}
      </div>
    </section>
  );
}

export function WeeklySummary({ summary }) {
  return (
    <section className="weekly-summary">
      <p className="dashboard-kicker">Weekly Summary</p>
      <h2 className="dashboard-section-title">What you learned this week</h2>
      <p className="product-status">
        {summary?.message || "Save responses to build your weekly summary."}
      </p>
      <InsightList insights={summary?.insights} />
    </section>
  );
}
