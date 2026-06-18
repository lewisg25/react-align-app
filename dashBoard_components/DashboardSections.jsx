import { motion as Motion } from "framer-motion";
import {
  formatQuestionOption,
  formatResponseDate,
  getQuestionKey,
} from "./dashboardHelpers";

const pluralDays = (days) => `${days} day${days === 1 ? "" : "s"}`;
const activeClass = (isActive, base) => (isActive ? `${base} active` : base);
const streakCalendarWeeks = 18;
const streakCalendarDays = streakCalendarWeeks * 7;
const weekdayLabels = ["", "M", "", "W", "", "F", ""];
const questionNumber = (question) => {
  const value = question?.questionId || question?._id || "";
  const fallbackMatch = String(value).match(/(\d+)$/);
  return fallbackMatch?.[1] || value || "?";
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateKey) => {
  const [year, month, day] = String(dateKey).split("-").map(Number);
  if ([year, month, day].every(Number.isFinite)) {
    return new Date(year, month - 1, day, 12);
  }
  return new Date();
};

const monthLabelFormatter = new Intl.DateTimeFormat(undefined, {
  month: "short",
});

const getResponseDateKey = (response = {}) => {
  const dateValue =
    response.responseDate ||
    response.dayIdentifier ||
    response.answeredAt ||
    response.createdAt ||
    response.updatedAt;

  if (!dateValue) return "";
  const value = String(dateValue);
  const directDate = value.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  if (directDate) return directDate;

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "" : toDateKey(parsedDate);
};

const getCompletedDates = ({
  answeredToday,
  currentStreak,
  responseHistory,
  today,
}) => {
  const completedDates = new Set(
    (responseHistory || []).map(getResponseDateKey).filter(Boolean)
  );

  if (answeredToday) completedDates.add(toDateKey(today));

  if (!completedDates.size && currentStreak > 0) {
    const fallbackEndDate = new Date(today);
    if (!answeredToday) fallbackEndDate.setDate(fallbackEndDate.getDate() - 1);

    const fallbackDays = Math.min(currentStreak, streakCalendarDays);
    for (let offset = 0; offset < fallbackDays; offset += 1) {
      const date = new Date(fallbackEndDate);
      date.setDate(fallbackEndDate.getDate() - offset);
      completedDates.add(toDateKey(date));
    }
  }

  return completedDates;
};

const buildStreakCalendar = ({
  answeredToday,
  responseHistory,
  streak,
  todayIdentifier,
}) => {
  const today = parseDateKey(todayIdentifier || toDateKey(new Date()));
  const todayKey = toDateKey(today);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (6 - today.getDay()));

  const startDate = new Date(weekEnd);
  startDate.setDate(weekEnd.getDate() - streakCalendarDays + 1);

  const currentStreak = Number(streak?.currentStreak) || 0;
  const completedDates = getCompletedDates({
    answeredToday,
    currentStreak,
    responseHistory,
    today,
  });

  const days = Array.from({ length: streakCalendarDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const dateKey = toDateKey(date);
    const isToday = dateKey === todayKey;
    const isComplete = completedDates.has(dateKey);
    const isQuestionnaireComplete = isToday && answeredToday;
    const className = [
      "streak-dot",
      isComplete ? "complete" : "",
      isQuestionnaireComplete ? "questionnaire-complete" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      className,
      dateKey,
      day: date.getDay() + 1,
      gridColumn: Math.floor(index / 7) + 1,
      label: `${monthLabelFormatter.format(date)} ${date.getDate()}`,
      status: isQuestionnaireComplete
        ? "Questionnaire complete"
        : isComplete
        ? "Complete"
        : "No response",
    };
  });

  const monthLabels = Array.from({ length: streakCalendarWeeks }, (_, week) => {
    const weekDate = new Date(startDate);
    weekDate.setDate(startDate.getDate() + week * 7);
    const previousWeek = new Date(weekDate);
    previousWeek.setDate(weekDate.getDate() - 7);

    return week === 0 || weekDate.getMonth() !== previousWeek.getMonth()
      ? monthLabelFormatter.format(weekDate)
      : "";
  });

  return { days, monthLabels };
};

const questionToneCount = 6;
const questionCardMotion = {
  transition: { type: "spring", stiffness: 360, damping: 26 },
  whileHover: { y: -4 },
  whileTap: { scale: 0.98 },
};

function QuestionOption({ index, isSelected, onSelect, question }) {
  const number = questionNumber(question);
  return (
    <Motion.button
      type="button"
      className={`${activeClass(
        isSelected,
        "question-option"
      )} question-tone-${(index % questionToneCount) + 1}`}
      key={getQuestionKey(question)}
      onClick={() => onSelect(getQuestionKey(question))}
      aria-label={formatQuestionOption(question)}
      aria-pressed={isSelected}
      {...questionCardMotion}
    >
      <span className="question-option-flip">
        <span className="question-option-face question-option-front">
          <span className="question-option-number">{number}</span>
          <span className="question-option-text">{question.text}</span>
        </span>
        <span className="question-option-face question-option-back" aria-hidden="true">
          <span className="question-option-back-label">
            {question.category || "Daily Reflection"}
          </span>
          <span className="question-option-back-text">
            {isSelected ? "Today's reflection" : `Question ${number}`}
          </span>
        </span>
      </span>
    </Motion.button>
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
  coupleNames,
  firstName,
  localDateTime,
  marriageYearsLabel,
  onLogout,
}) {
  return (
    <section className="dashboard-topbar">
      <div className="dashboard-identity">
        <h1 className="dashboard-welcome">Welcome, {firstName}</h1>
        <p className="couple-name-line">
          {coupleNames.userName} and {coupleNames.partnerName}
        </p>
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

export function StreakStrip({
  answeredToday,
  responseHistory,
  streak,
  todayIdentifier,
}) {
  const calendar = buildStreakCalendar({
    answeredToday,
    responseHistory,
    streak,
    todayIdentifier,
  });

  return (
    <section className="streak-strip">
      <div className="streak-calendar-card">
        <div className="streak-calendar-header">
          <div>
            <p className="dashboard-kicker">Daily streak</p>
            <strong>{pluralDays(streak?.currentStreak || 0)}</strong>
          </div>
          <div>
            <p className="dashboard-kicker">Best streak</p>
            <strong>{pluralDays(streak?.longestStreak || 0)}</strong>
          </div>
        </div>
        <div
          className="streak-calendar"
          aria-label="Daily questionnaire completion calendar"
        >
          <div className="streak-months" aria-hidden="true">
            {calendar.monthLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className="streak-weekdays" aria-hidden="true">
            {weekdayLabels.map((label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ))}
          </div>
          <div className="streak-dot-grid">
            {calendar.days.map((day) => (
              <span
                aria-label={`${day.label}: ${day.status}`}
                className={day.className}
                key={day.dateKey}
                style={{
                  gridColumn: day.gridColumn,
                  gridRow: day.day,
                }}
                title={`${day.label}: ${day.status}`}
              />
            ))}
          </div>
        </div>
        <div className="streak-legend" aria-hidden="true">
          <span>
            <i className="streak-legend-dot complete" />
            Complete
          </span>
          <span>
            <i className="streak-legend-dot questionnaire-complete" />
            Questionnaire complete
          </span>
        </div>
      </div>
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
        {questions.map((question, index) => (
          <QuestionOption
            question={question}
            index={index}
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
