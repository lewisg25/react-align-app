import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteResponse,
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
} from "./dashboardHelpers";
import {
  getEditableResponseForDate,
  initialDashboardModel,
  loadDashboardModel,
  removeResponseFromModel,
  saveResponseToModel,
} from "./dashboardModelHelpers";

export function useDashboardModel() {
  const [model, setModel] = useState(initialDashboardModel);
  const [editableResponse, setEditableResponse] = useState(null);
  const [selectedResponseDate, setSelectedResponseDate] =
    useState(getTodayIdentifier);
  const [selectedQuestionKey, setSelectedQuestionKey] = useState("");
  const [localNow, setLocalNow] = useState(() => new Date());
  const [error, setError] = useState("");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const navigate = useNavigate();
  const { signOut, user: sessionUser } = useAuth();

  const weekIdentifier = useMemo(() => getCurrentWeekIdentifier(), []);
  const todayIdentifier = useMemo(() => getTodayIdentifier(), []);
  const localDateTime = useMemo(
    () => formatLocalDashboardTime(localNow),
    [localNow]
  );
  const user = model.dashboard?.user || sessionUser;
  const questions = useMemo(
    () => getDashboardQuestions(model.questionData?.questions || []),
    [model.questionData?.questions]
  );
  const selectedQuestion = useMemo(
    () =>
      questions.find(
        (question) => getQuestionKey(question) === selectedQuestionKey
      ) || questions[0],
    [questions, selectedQuestionKey]
  );
  const selectedDateIsToday = selectedResponseDate === todayIdentifier;
  const savedResponsesForSelectedQuestion = useMemo(
    () =>
      model.responseHistory.filter((response) =>
        isSameQuestion(response, selectedQuestion)
      ),
    [model.responseHistory, selectedQuestion]
  );
  const selectedSavedResponse = useMemo(
    () =>
      savedResponsesForSelectedQuestion.find(
        (response) => response.responseDate === selectedResponseDate
      ) || null,
    [savedResponsesForSelectedQuestion, selectedResponseDate]
  );
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

  useEffect(() => {
    const timer = window.setInterval(() => setLocalNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const nextModel = await loadDashboardModel(weekIdentifier);
        if (isMounted) setModel(nextModel);
      } catch (error) {
        if (isMounted)
          setError(error.message || "We could not load your dashboard yet.");
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
    setEditableResponse(
      getEditableResponseForDate({
        currentResponse: model.questionData?.currentResponse,
        isToday: selectedDateIsToday,
        savedResponse: selectedSavedResponse,
        storageKey: editableResponseStorageKey,
      })
    );
  }, [
    editableResponseStorageKey,
    model.questionData?.currentResponse,
    selectedDateIsToday,
    selectedQuestion,
    selectedSavedResponse,
  ]);

  const refreshWeeklySummary = async () => {
    const summary = await getSummary(weekIdentifier);
    setModel((current) => ({ ...current, summary }));
  };

  const cacheResponse = (response, streak = null) => {
    setEditableResponse(response);
    localStorage.setItem(editableResponseStorageKey, JSON.stringify(response));
    setModel((current) =>
      saveResponseToModel(current, response, streak, selectedDateIsToday)
    );
  };

  const saveSelectedResponse = async (
    response,
    request,
    currentResponse = null
  ) => {
    const payload = {
      ...response,
      weekIdentifier,
      responseDate: selectedResponseDate,
    };
    const result = await request(payload);
    cacheResponse(
      buildEditableResponse(response, result, currentResponse),
      result.streak
    );
    await refreshWeeklySummary();
    return result;
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleQuestionSelect = (questionKey) => {
    setSelectedQuestionKey(questionKey);
    setSelectedResponseDate(todayIdentifier);
  };

  const handleSaveResponse = (response) =>
    saveSelectedResponse(response, saveResponse);

  const handleUpdateResponse = (response) =>
    saveSelectedResponse(
      response,
      (payload) => updateResponse(response.responseId, payload),
      editableResponse
    );

  const handleDeleteResponse = async (response) => {
    const hasAnotherTodayResponse = model.responseHistory.some(
      (savedResponse) =>
        savedResponse.id !== response.id &&
        savedResponse.responseDate === todayIdentifier
    );
    const result = await deleteResponse(response.id, {
      questionId: response.questionId,
      questionIdNumber: response.questionIdNumber,
      questionKey: response.questionKey,
      weekIdentifier,
      responseDate: response.responseDate || selectedResponseDate,
    });

    setEditableResponse(null);
    localStorage.removeItem(editableResponseStorageKey);
    setModel((current) =>
      removeResponseFromModel(
        current,
        response,
        selectedDateIsToday,
        hasAnotherTodayResponse
      )
    );
    await refreshWeeklySummary();
    return result;
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
    questionData: model.questionData,
    questions,
    savedResponsesForSelectedQuestion,
    selectedDateIsToday,
    selectedQuestion,
    selectedResponseDate,
    setSelectedResponseDate,
    streak: model.streak,
    summary: model.summary,
    todayIdentifier,
    user,
  };
}
