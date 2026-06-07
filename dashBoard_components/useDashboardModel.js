import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteResponse,
  getDashboard,
  getQuestions,
  getResponses,
  getSummary,
  saveResponse,
  updateResponse,
} from "../src/api";
import { useAuth } from "../src/useAuth";
import {
  buildEditableResponse,
  formatLocalDashboardTime,
  getCurrentWeekIdentifier,
  getDashboardQuestions,
  getEditableResponseStorageKey,
  getQuestionKey,
  getTodayIdentifier,
  isSameQuestion,
  loadStoredEditableResponse,
} from "./dashboardHelpers";

export function useDashboardModel() {
  const [dashboard, setDashboard] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [editableResponse, setEditableResponse] = useState(null);
  const [responseHistory, setResponseHistory] = useState([]);
  const [selectedResponseDate, setSelectedResponseDate] = useState(getTodayIdentifier);
  const [selectedQuestionKey, setSelectedQuestionKey] = useState("");
  const [localNow, setLocalNow] = useState(() => new Date());
  const [error, setError] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const navigate = useNavigate();
  const { signOut, user: sessionUser } = useAuth();
  const weekIdentifier = useMemo(() => getCurrentWeekIdentifier(), []);
  const todayIdentifier = useMemo(() => getTodayIdentifier(), []);
  const localDateTime = useMemo(() => formatLocalDashboardTime(localNow), [localNow]);
  const user = dashboard?.user || sessionUser;
  const questions = useMemo(
    () => getDashboardQuestions(questionData?.questions || []),
    [questionData?.questions]
  );
  const selectedQuestion = useMemo(
    () => questions.find((question) => getQuestionKey(question) === selectedQuestionKey) || questions[0],
    [questions, selectedQuestionKey]
  );
  const selectedDateIsToday = selectedResponseDate === todayIdentifier;
  const savedResponsesForSelectedQuestion = useMemo(
    () => responseHistory.filter((response) => isSameQuestion(response, selectedQuestion)),
    [responseHistory, selectedQuestion]
  );
  const selectedSavedResponse = useMemo(
    () =>
      savedResponsesForSelectedQuestion.find(
        (response) =>
          response.responseDate === selectedResponseDate &&
          isSameQuestion(response, selectedQuestion)
      ) || null,
    [savedResponsesForSelectedQuestion, selectedQuestion, selectedResponseDate]
  );
  const editableResponseStorageKey = useMemo(
    () => getEditableResponseStorageKey(user, weekIdentifier, selectedQuestion, selectedResponseDate),
    [user, weekIdentifier, selectedQuestion, selectedResponseDate]
  );

  useEffect(() => {
    const timer = window.setInterval(() => setLocalNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [dashboardData, questionsData, responsesData, summaryData] = await Promise.all([
          getDashboard(),
          getQuestions(),
          getResponses(),
          getSummary(weekIdentifier),
        ]);

        if (!isMounted) return;
        setDashboard(dashboardData);
        setQuestionData(questionsData);
        setResponseHistory(responsesData.responses || []);
        setSummary(summaryData);
        setStreak({
          currentStreak: dashboardData.user?.currentStreak || 0,
          longestStreak: dashboardData.user?.longestStreak || 0,
        });
      } catch (err) {
        if (isMounted) setError(err.message || "We could not load your dashboard yet.");
      } finally {
        if (isMounted) setIsLoadingQuestions(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [weekIdentifier]);

  useEffect(() => {
    if (questions.length && !selectedQuestionKey) {
      setSelectedQuestionKey(getQuestionKey(questions[0]));
    }
  }, [questions, selectedQuestionKey]);

  useEffect(() => {
    if (!selectedQuestion) return;
    const responseForSelectedDate =
      selectedSavedResponse || (selectedDateIsToday ? questionData?.currentResponse : null);

    if (!responseForSelectedDate) {
      setEditableResponse(
        selectedDateIsToday ? loadStoredEditableResponse(editableResponseStorageKey) : null
      );
      return;
    }

    const currentEditableResponse = buildEditableResponse(
      responseForSelectedDate,
      responseForSelectedDate
    );
    setEditableResponse(currentEditableResponse);
    localStorage.setItem(editableResponseStorageKey, JSON.stringify(currentEditableResponse));
  }, [
    editableResponseStorageKey,
    questionData?.currentResponse,
    selectedDateIsToday,
    selectedQuestion,
    selectedSavedResponse,
  ]);

  const refreshWeeklySummary = async () => {
    setSummary(await getSummary(weekIdentifier));
  };

  const updateResponseHistory = (nextResponse) => {
    setResponseHistory((responses) => {
      const exists = responses.some((response) => response.id === nextResponse.id);
      return exists
        ? responses.map((response) => (response.id === nextResponse.id ? nextResponse : response))
        : [nextResponse, ...responses];
    });
  };

  const cacheEditableResponse = (nextEditableResponse) => {
    setEditableResponse(nextEditableResponse);
    updateResponseHistory(nextEditableResponse);
    localStorage.setItem(editableResponseStorageKey, JSON.stringify(nextEditableResponse));
  };

  const markQuestionAnswered = (nextEditableResponse) => {
    setQuestionData((currentData) =>
      currentData
        ? {
            ...currentData,
            answeredToday: selectedDateIsToday ? true : currentData.answeredToday,
            currentResponse: selectedDateIsToday ? nextEditableResponse : currentData.currentResponse,
            message: selectedDateIsToday
              ? "You already completed today’s check-in. You can update your saved response."
              : currentData.message,
          }
        : currentData
    );
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleQuestionSelect = (questionKey) => {
    setSelectedQuestionKey(questionKey);
    setSelectedResponseDate(todayIdentifier);
  };

  const handleSaveResponse = async (response) => {
    const saveResult = await saveResponse({ ...response, weekIdentifier, responseDate: selectedResponseDate });
    const nextEditableResponse = buildEditableResponse(response, saveResult);

    if (saveResult.streak) setStreak(saveResult.streak);
    cacheEditableResponse(nextEditableResponse);
    markQuestionAnswered(nextEditableResponse);
    await refreshWeeklySummary();
    return saveResult;
  };

  const handleUpdateResponse = async (response) => {
    const updateResult = await updateResponse(response.responseId, {
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    });
    const nextEditableResponse = buildEditableResponse(response, updateResult, editableResponse);

    cacheEditableResponse(nextEditableResponse);
    markQuestionAnswered(nextEditableResponse);
    await refreshWeeklySummary();
    return updateResult;
  };

  const handleDeleteResponse = async (response) => {
    const hasAnotherTodayResponse = responseHistory.some((savedResponse) => {
      return savedResponse.id !== response.id && savedResponse.responseDate === todayIdentifier;
    });
    const deleteResult = await deleteResponse(response.id, {
      questionId: response.questionId,
      questionIdNumber: response.questionIdNumber,
      questionKey: response.questionKey,
      weekIdentifier,
      responseDate: response.responseDate || selectedResponseDate,
    });

    setEditableResponse(null);
    setResponseHistory((responses) => responses.filter((savedResponse) => savedResponse.id !== response.id));
    localStorage.removeItem(editableResponseStorageKey);
    setQuestionData((currentData) =>
      currentData
        ? {
            ...currentData,
            answeredToday: selectedDateIsToday ? hasAnotherTodayResponse : currentData.answeredToday,
            currentResponse: selectedDateIsToday ? null : currentData.currentResponse,
            message: selectedDateIsToday ? "" : currentData.message,
          }
        : currentData
    );
    await refreshWeeklySummary();
    return deleteResult;
  };

  return {
    editableResponse,
    error,
    handleDeleteResponse,
    handleLogout,
    handleQuestionSelect,
    handleSaveResponse,
    handleUpdateResponse,
    isLoadingQuestions,
    localDateTime,
    questionData,
    questions,
    savedResponsesForSelectedQuestion,
    selectedQuestion,
    selectedDateIsToday,
    selectedResponseDate,
    setSelectedResponseDate,
    streak,
    summary,
    todayIdentifier,
    user,
  };
}
