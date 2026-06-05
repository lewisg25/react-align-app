import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReflectionScreen from "./ReflectionScreen";
import {
  DashboardTopbar,
  QuestionPanel,
  QuestionPicker,
  ResponseHistoryPanel,
  StreakStrip,
  WeeklySummary,
} from "./DashboardSections";
import {
  buildEditableResponse,
  formatLocalDashboardTime,
  getCurrentWeekIdentifier,
  getDashboardQuestions,
  getEditableResponseStorageKey,
  getQuestionKey,
  getRelationshipTierLabel,
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
  const [selectedResponseDate, setSelectedResponseDate] = useState(() =>
    getTodayIdentifier()
  );
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
        const [dashboardData, questionsData, responsesData, summaryData] =
          await Promise.all([
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
  const questions = useMemo(() => {
    return getDashboardQuestions(questionData?.questions || []);
  }, [questionData?.questions]);
  const selectedQuestion = useMemo(() => {
    return (
      questions.find((question) => getQuestionKey(question) === selectedQuestionKey) ||
      questions[0]
    );
  }, [questions, selectedQuestionKey]);
  const todayIdentifier = useMemo(() => getTodayIdentifier(), []);
  const selectedDateIsToday = selectedResponseDate === todayIdentifier;
  const savedResponsesForSelectedQuestion = useMemo(() => {
    return responseHistory.filter((response) => isSameQuestion(response, selectedQuestion));
  }, [responseHistory, selectedQuestion]);
  const selectedSavedResponse = useMemo(() => {
    return (
      savedResponsesForSelectedQuestion.find((response) => {
        return (
          response.responseDate === selectedResponseDate &&
          isSameQuestion(response, selectedQuestion)
        );
      }) || null
    );
  }, [savedResponsesForSelectedQuestion, selectedQuestion, selectedResponseDate]);
  const editableResponseStorageKey = useMemo(
    () =>
      getEditableResponseStorageKey(
        user,
        weekIdentifier,
        selectedQuestion,
        selectedResponseDate
      ),
    [user, weekIdentifier, selectedQuestion, selectedResponseDate]
  );
  const answeredToday = Boolean(questionData?.answeredToday);
  const tierLabel = getRelationshipTierLabel(questionData, user);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleQuestionSelect = (questionKey) => {
    setSelectedQuestionKey(questionKey);
    setSelectedResponseDate(todayIdentifier);
  };

  const updateResponseHistory = (nextResponse) => {
    setResponseHistory((currentResponses) => {
      const exists = currentResponses.some((response) => response.id === nextResponse.id);

      if (!exists) return [nextResponse, ...currentResponses];

      return currentResponses.map((response) => {
        return response.id === nextResponse.id ? nextResponse : response;
      });
    });
  };

  const refreshWeeklySummary = async () => {
    const summaryData = await getWeeklySummary(weekIdentifier);
    setSummary(summaryData);
  };

  const cacheEditableResponse = (nextEditableResponse) => {
    setEditableResponse(nextEditableResponse);
    updateResponseHistory(nextEditableResponse);
    localStorage.setItem(
      editableResponseStorageKey,
      JSON.stringify(nextEditableResponse)
    );
  };

  const markQuestionAnswered = (nextEditableResponse) => {
    setQuestionData((currentData) =>
      currentData
        ? {
            ...currentData,
            answeredToday: selectedDateIsToday ? true : currentData.answeredToday,
            currentResponse: selectedDateIsToday
              ? nextEditableResponse
              : currentData.currentResponse,
            message: selectedDateIsToday
              ? "You already completed today’s check-in. You can update your saved response."
              : currentData.message,
          }
        : currentData
    );
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
      localStorage.setItem(
        editableResponseStorageKey,
        JSON.stringify(currentEditableResponse)
      );
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

  const handleSaveResponse = async (response) => {
    const saveResult = await saveCheckInResponse({
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    });
    const nextEditableResponse = buildEditableResponse(response, saveResult);

    if (saveResult.streak) setStreak(saveResult.streak);
    cacheEditableResponse(nextEditableResponse);
    markQuestionAnswered(nextEditableResponse);
    await refreshWeeklySummary();
    return saveResult;
  };

  const handleUpdateResponse = async (response) => {
    const updateResult = await updateCheckInResponse(response.responseId, {
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    });
    const nextEditableResponse = buildEditableResponse(
      response,
      updateResult,
      editableResponse
    );

    cacheEditableResponse(nextEditableResponse);
    markQuestionAnswered(nextEditableResponse);
    await refreshWeeklySummary();
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
    setEditableResponse(null);
    setResponseHistory((currentResponses) => {
      return currentResponses.filter((savedResponse) => savedResponse.id !== response.id);
    });
    localStorage.removeItem(editableResponseStorageKey);
    setQuestionData((currentData) =>
      currentData
        ? {
            ...currentData,
            answeredToday: selectedDateIsToday
              ? hasAnotherTodayResponse
              : currentData.answeredToday,
            currentResponse: selectedDateIsToday ? null : currentData.currentResponse,
            message: selectedDateIsToday ? "" : currentData.message,
          }
        : currentData
    );
    await refreshWeeklySummary();
    return deleteResult;
  };

  const isPreviousDateWithoutResponse = !selectedDateIsToday && !editableResponse;

  return (
    <main className="dashboard-shell">
      <DashboardTopbar
        firstName={firstName}
        localDateTime={localDateTime}
        onLogout={handleLogout}
      />
      <StreakStrip streak={streak} />

      {error && <p className="error-message">{error}</p>}

      <section className="dashboard-content">
        <QuestionPanel
          answeredToday={answeredToday}
          isLoadingQuestions={isLoadingQuestions}
          questions={questions}
          tierLabel={tierLabel}
        />
        <QuestionPicker
          onQuestionSelect={handleQuestionSelect}
          questions={questions}
          selectedQuestion={selectedQuestion}
        />
        <ResponseHistoryPanel
          onSelectResponseDate={setSelectedResponseDate}
          savedResponses={savedResponsesForSelectedQuestion}
          selectedResponseDate={selectedResponseDate}
          todayIdentifier={todayIdentifier}
        />

        <ReflectionScreen
          key={
            selectedQuestion?._id ||
            selectedQuestion?.questionId ||
            selectedQuestion?.text ||
            "daily-question"
          }
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

        <WeeklySummary summary={summary} />
      </section>
    </main>
  );
};

export default Dashboard;
