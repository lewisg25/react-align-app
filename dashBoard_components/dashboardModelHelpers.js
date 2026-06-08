import { getDashboard, getQuestions, getResponses, getSummary } from "../src/api";
import { buildEditableResponse, loadStoredEditableResponse } from "./dashboardHelpers";

const answeredMessage =
  "You already completed today’s check-in. You can update your saved response.";

export const initialDashboardModel = {
  dashboard: null,
  questionData: null,
  responseHistory: [],
  streak: null,
  summary: null,
};

export const createDashboardModel = ({ dashboard, questionData, responseData, summary }) => ({
  dashboard,
  questionData,
  responseHistory: responseData.responses || [],
  streak: {
    currentStreak: dashboard?.user?.currentStreak || 0,
    longestStreak: dashboard?.user?.longestStreak || 0,
  },
  summary,
});

export async function loadDashboardModel(weekIdentifier) {
  const [dashboard, questionData, responseData, summary] = await Promise.all([
    getDashboard(),
    getQuestions(),
    getResponses(),
    getSummary(weekIdentifier),
  ]);

  return createDashboardModel({ dashboard, questionData, responseData, summary });
}

export function getEditableResponseForDate({
  currentResponse,
  isToday,
  savedResponse,
  storageKey,
}) {
  const response = savedResponse || (isToday ? currentResponse : null);

  if (!response) return isToday ? loadStoredEditableResponse(storageKey) : null;

  const editableResponse = buildEditableResponse(response, response);
  localStorage.setItem(storageKey, JSON.stringify(editableResponse));
  return editableResponse;
}

export const upsertResponse = (responses, nextResponse) =>
  responses.some((response) => response.id === nextResponse.id)
    ? responses.map((response) => (response.id === nextResponse.id ? nextResponse : response))
    : [nextResponse, ...responses];

export const markAnsweredToday = (questionData, response, isToday) =>
  questionData && isToday
    ? { ...questionData, answeredToday: true, currentResponse: response, message: answeredMessage }
    : questionData;

export const markDeletedToday = (questionData, isToday, hasAnotherTodayResponse) =>
  questionData && isToday
    ? { ...questionData, answeredToday: hasAnotherTodayResponse, currentResponse: null, message: "" }
    : questionData;

export const saveResponseToModel = (model, response, streak, isToday) => ({
  ...model,
  streak: streak || model.streak,
  responseHistory: upsertResponse(model.responseHistory, response),
  questionData: markAnsweredToday(model.questionData, response, isToday),
});

export const removeResponseFromModel = (model, response, isToday, hasAnotherTodayResponse) => ({
  ...model,
  responseHistory: model.responseHistory.filter((savedResponse) => savedResponse.id !== response.id),
  questionData: markDeletedToday(model.questionData, isToday, hasAnotherTodayResponse),
});
