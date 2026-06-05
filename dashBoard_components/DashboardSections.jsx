import {
  formatQuestionOption,
  formatResponseDate,
  getQuestionKey,
} from "./dashboardHelpers";

export function DashboardTopbar({ firstName, localDateTime, onLogout }) {
  return (
    <section className="dashboard-topbar">
      <div>
        <h1 className="dashboard-welcome">Welcome, {firstName}</h1>
      </div>
      <div className="dashboard-actions">
        <div className="local-time-card" aria-live="polite">
          <p className="dashboard-kicker">Local time</p>
          <strong>{localDateTime.time}</strong>
          <span>{localDateTime.date}</span>
        </div>
        <button type="button" className="btn-solid dashboard-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </section>
  );
}

export function StreakStrip({ streak }) {
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;

  return (
    <section className="streak-strip">
      <div>
        <p className="dashboard-kicker">Daily streak</p>
        <strong>{currentStreak} day{currentStreak === 1 ? "" : "s"}</strong>
      </div>
      <div>
        <p className="dashboard-kicker">Best streak</p>
        <strong>{longestStreak} day{longestStreak === 1 ? "" : "s"}</strong>
      </div>
    </section>
  );
}

export function QuestionPanel({ answeredToday, isLoadingQuestions, questions, tierLabel }) {
  return (
    <div className="question-panel">
      <div>
        <p className="dashboard-kicker">Questions for your relationship stage</p>
        <h2 className="dashboard-section-title">{tierLabel}</h2>
      </div>

      {isLoadingQuestions && <p className="product-status">Loading your questions...</p>}

      {!isLoadingQuestions && questions.length > 0 && (
        <p className={answeredToday ? "daily-status complete" : "daily-status"}>
          {answeredToday ? "A response is saved for today." : "Today’s questions are ready."}
        </p>
      )}

      {!isLoadingQuestions && !questions.length && (
        <p className="product-status">No questions are available yet for this stage.</p>
      )}
    </div>
  );
}

export function QuestionPicker({ onQuestionSelect, questions, selectedQuestion }) {
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
          <option value={getQuestionKey(question)} key={getQuestionKey(question)}>
            {formatQuestionOption(question)}
          </option>
        ))}
      </select>

      <div className="question-list" aria-label="Available questions">
        {questions.map((question) => {
          const questionKey = getQuestionKey(question);
          const isSelected = questionKey === getQuestionKey(selectedQuestion);

          return (
            <button
              type="button"
              className={isSelected ? "question-option active" : "question-option"}
              key={questionKey}
              onClick={() => onQuestionSelect(questionKey)}
              aria-label={formatQuestionOption(question)}
            >
              <span className="question-option-number">{question.questionId}</span>
              <span className="question-option-text">{question.text}</span>
            </button>
          );
        })}
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
        {savedResponses.map((savedResponse) => (
          <button
            type="button"
            className={
              savedResponse.responseDate === selectedResponseDate
                ? "saved-response-chip active"
                : "saved-response-chip"
            }
            key={savedResponse.id}
            onClick={() => onSelectResponseDate(savedResponse.responseDate || todayIdentifier)}
          >
            {formatResponseDate(savedResponse.responseDate)}
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
  );
}
