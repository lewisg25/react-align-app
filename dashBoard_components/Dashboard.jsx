import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReflectionScreen from "./ReflectionScreen";
import {
  buildEditableResponse,
  formatLocalDashboardTime,
  formatQuestionOption,
  formatResponseDate,
  getCurrentWeekIdentifier,
  getEditableResponseStorageKey,
  getQuestionKey,
  getTodayIdentifier,
  isSameQuestion,
  loadStoredEditableResponse,
} from "./dashboardHelpers";
import {
  clearAuth,
  deleteCheckInResponse,
  getCheckInQuestions,
  getCheckInResponses,
  getDashboard,
  getStoredAuth,
  getWeeklySummary,
  saveCheckInResponse,
  updateCheckInResponse,
} from "../src/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [editableResponse, setEditableResponse] = useState(null);
  const [responseHistory, setResponseHistory] = useState([]);
  const [selectedResponseDate, setSelectedResponseDate] = useState(() => getTodayIdentifier());
  const [selectedQuestionKey, setSelectedQuestionKey] = useState("");
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
        const [dashboardData, questionsData, responsesData, summaryData] = await Promise.all([
          getDashboard(),
          getCheckInQuestions(),
          getCheckInResponses(),
          getWeeklySummary(weekIdentifier),
        ]);

        if (isMounted) {
          setDashboard(dashboardData);
          setQuestionData(questionsData);
          setResponseHistory(responsesData.responses || []);
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
  const questions = useMemo(() => questionData?.questions || [], [questionData?.questions]);
  const selectedQuestion = useMemo(() => {
    return questions.find((question) => getQuestionKey(question) === selectedQuestionKey) || questions[0];
  }, [questions, selectedQuestionKey]);
  const todayIdentifier = useMemo(() => getTodayIdentifier(), []);
  const selectedDateIsToday = selectedResponseDate === todayIdentifier;
  const savedResponsesForSelectedQuestion = useMemo(() => {
    return responseHistory.filter((response) => isSameQuestion(response, selectedQuestion));
  }, [responseHistory, selectedQuestion]);
  const selectedSavedResponse = useMemo(() => {
    return savedResponsesForSelectedQuestion.find((response) => {
      return response.responseDate === selectedResponseDate && isSameQuestion(response, selectedQuestion);
    }) || null;
  }, [savedResponsesForSelectedQuestion, selectedQuestion, selectedResponseDate]);
  const editableResponseStorageKey = useMemo(
    () => getEditableResponseStorageKey(user, weekIdentifier, selectedQuestion, selectedResponseDate),
    [user, weekIdentifier, selectedQuestion, selectedResponseDate]
  );
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

  const handleQuestionSelect = (questionKey) => {
    setSelectedQuestionKey(questionKey);
    setSelectedResponseDate(todayIdentifier);
  };

  useEffect(() => {
    if (!questions.length || selectedQuestionKey) return;

    setSelectedQuestionKey(getQuestionKey(questions[0]));
  }, [questions, selectedQuestionKey]);

  useEffect(() => {
    if (!selectedQuestion) return;

    const responseForSelectedDate = selectedSavedResponse ||
      (selectedDateIsToday ? questionData?.currentResponse : null);

    if (responseForSelectedDate) {
      const currentEditableResponse = buildEditableResponse(
        responseForSelectedDate,
        responseForSelectedDate
      );

      setEditableResponse(currentEditableResponse);
      localStorage.setItem(editableResponseStorageKey, JSON.stringify(currentEditableResponse));
      return;
    }

    setEditableResponse(
      selectedDateIsToday ? loadStoredEditableResponse(editableResponseStorageKey) : null
    );
  }, [
    editableResponseStorageKey,
    questionData?.currentResponse,
    selectedDateIsToday,
    selectedQuestion,
    selectedSavedResponse,
  ]);

  const updateResponseHistory = (nextResponse) => {
    setResponseHistory((currentResponses) => {
      const exists = currentResponses.some((response) => response.id === nextResponse.id);

      if (!exists) return [nextResponse, ...currentResponses];

      return currentResponses.map((response) => {
        return response.id === nextResponse.id ? nextResponse : response;
      });
    });
  };

  const handleSaveResponse = async (response) => {
    const saveResult = await saveCheckInResponse({
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    });
    const nextEditableResponse = buildEditableResponse(response, saveResult);

    if (saveResult.streak) setStreak(saveResult.streak);
    setEditableResponse(nextEditableResponse);
    updateResponseHistory(nextEditableResponse);
    localStorage.setItem(editableResponseStorageKey, JSON.stringify(nextEditableResponse));
    setQuestionData((currentData) => currentData ? {
      ...currentData,
      answeredToday: selectedDateIsToday ? true : currentData.answeredToday,
      currentResponse: selectedDateIsToday ? nextEditableResponse : currentData.currentResponse,
      message: selectedDateIsToday
        ? "You already completed today’s check-in. You can update your saved response."
        : currentData.message,
    } : currentData);
    const summaryData = await getWeeklySummary(weekIdentifier);
    setSummary(summaryData);
    return saveResult;
  };

  const handleUpdateResponse = async (response) => {
    const updateResult = await updateCheckInResponse(response.responseId, {
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    });
    const nextEditableResponse = buildEditableResponse(response, updateResult, editableResponse);

    setEditableResponse(nextEditableResponse);
    updateResponseHistory(nextEditableResponse);
    localStorage.setItem(editableResponseStorageKey, JSON.stringify(nextEditableResponse));
    setQuestionData((currentData) => currentData ? {
      ...currentData,
      answeredToday: selectedDateIsToday ? true : currentData.answeredToday,
      currentResponse: selectedDateIsToday ? nextEditableResponse : currentData.currentResponse,
      message: selectedDateIsToday
        ? "You already completed today’s check-in. You can update your saved response."
        : currentData.message,
    } : currentData);
    const summaryData = await getWeeklySummary(weekIdentifier);
    setSummary(summaryData);
    return updateResult;
  };

  const handleDeleteResponse = async (response) => {
    const hasAnotherTodayResponse = responseHistory.some((savedResponse) => {
      return savedResponse.id !== response.id && savedResponse.responseDate === todayIdentifier;
    });
    const deleteResult = await deleteCheckInResponse(response.id, {
      questionId: response.questionId,
      questionIdNumber: response.questionIdNumber,
      questionKey: response.questionKey,
      weekIdentifier,
      responseDate: response.responseDate || selectedResponseDate,
    });
    const summaryData = await getWeeklySummary(weekIdentifier);
    setEditableResponse(null);
    setResponseHistory((currentResponses) => {
      return currentResponses.filter((savedResponse) => savedResponse.id !== response.id);
    });
    localStorage.removeItem(editableResponseStorageKey);
    setQuestionData((currentData) => currentData ? {
      ...currentData,
      answeredToday: selectedDateIsToday ? hasAnotherTodayResponse : currentData.answeredToday,
      currentResponse: selectedDateIsToday ? null : currentData.currentResponse,
      message: selectedDateIsToday ? "" : currentData.message,
    } : currentData);
    setSummary(summaryData);
    return deleteResult;
  };

  const isPreviousDateWithoutResponse = !selectedDateIsToday && !editableResponse;
  return (
    <main className="dashboard-shell">
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
              {answeredToday ? "A response is saved for today." : "Today’s questions are ready."}
            </p>
          )}

          {!isLoadingQuestions && !questions.length && (
            <p className="product-status">No questions are available yet for this stage.</p>
          )}
        </div>

        {questions.length > 0 && (
          <section className="question-picker">
            <label htmlFor="question-select">Question</label>
            <select
              id="question-select"
              className="question-select"
              value={getQuestionKey(selectedQuestion)}
              onChange={(event) => handleQuestionSelect(event.target.value)}
            >
              {questions.map((question) => (
                <option value={getQuestionKey(question)} key={getQuestionKey(question)}>
                  {formatQuestionOption(question)}
                </option>
              ))}
            </select>

            <div className="question-list" aria-label="Available questions">
              {questions.map((question) => (
                <button
                  type="button"
                  className={
                    getQuestionKey(question) === getQuestionKey(selectedQuestion)
                      ? "question-option active"
                      : "question-option"
                  }
                  key={getQuestionKey(question)}
                  onClick={() => handleQuestionSelect(getQuestionKey(question))}
                  aria-label={formatQuestionOption(question)}
                >
                  <span className="question-option-number">{question.questionId}</span>
                  <span className="question-option-text">{question.text}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="response-history-panel">
          <div className="saved-response-list" aria-label="Saved responses">
            {savedResponsesForSelectedQuestion.length > 0 ? (
              savedResponsesForSelectedQuestion.map((savedResponse) => (
                <button
                  type="button"
                  className={
                    savedResponse.responseDate === selectedResponseDate
                      ? "saved-response-chip active"
                      : "saved-response-chip"
                  }
                  key={savedResponse.id}
                  onClick={() => setSelectedResponseDate(savedResponse.responseDate || todayIdentifier)}
                >
                  {formatResponseDate(savedResponse.responseDate)}
                </button>
              ))
            ) : (
              <p className="product-status">Saved responses for this question will appear here.</p>
            )}
          </div>
        </section>

        <ReflectionScreen
          key={selectedQuestion?._id || selectedQuestion?.questionId || selectedQuestion?.text || "daily-question"}
          question={selectedQuestion}
          editableResponse={editableResponse}
          onSave={handleSaveResponse}
          onUpdate={handleUpdateResponse}
          onDelete={handleDeleteResponse}
          isLocked={isPreviousDateWithoutResponse}
          lockedMessage={
            isPreviousDateWithoutResponse
              ? "No saved response was found for this day."
              : questionData?.message
          }
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
