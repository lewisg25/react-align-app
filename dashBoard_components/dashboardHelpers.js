const responseKey = "alignEditableResponse";
const fallbackQuestionData = [
  ["Connection", "What made you feel most connected to your partner this week?"],
  ["Communication", "What is one conversation you want to have with more honesty or tenderness?"],
  ["Appreciation", "What is something your partner did recently that you appreciated?"],
  ["Support", "Where could you use more support from your partner right now?"],
  ["Growth", "What pattern would you like the two of you to improve together?"],
  ["Repair", "Is there anything small you want to repair before it becomes bigger?"],
  ["Intention", "What is one intention you want to bring into your relationship tomorrow?"],
];
const fallbackQuestions = fallbackQuestionData.map(([category, text], index) => ({ _id: `fallback-question-${index + 1}`, questionId: index + 1, category, text }));
const savedResponseFrom = (result = {}) => result.response || result.checkInResponse || result.data || result;
export const getTodayIdentifier = () => new Date().toISOString().slice(0, 10);
export const getQuestionKey = (question) => question?._id || question?.questionId || question?.text || "daily-question";
export function getCurrentWeekIdentifier() {
  const now = new Date(), date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
export const formatLocalDashboardTime = (date) => ({
  date: new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date),
  time: new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(date),
});
export function buildEditableResponse(response, saveResult = {}, currentResponse = null) {
  const saved = savedResponseFrom(saveResult), source = { ...saved, ...response };
  return { ...currentResponse, id: saved?._id || saved?.id || saveResult.responseId || currentResponse?.id || null,
    questionId: source.questionId, questionIdNumber: source.questionIdNumber, questionKey: source.questionKey,
    questionText: source.questionText, category: source.category, answerText: source.answerText, moodScale: source.moodScale,
    responseDate: source.responseDate || currentResponse?.responseDate || getTodayIdentifier(),
    weekIdentifier: source.weekIdentifier || currentResponse?.weekIdentifier,
    savedAt: currentResponse?.savedAt || saved?.createdAt || saved?.answeredAt || new Date().toISOString() };
}
export const getEditableResponseStorageKey = (user, week, question, date) =>
  `${responseKey}:${user?._id || user?.id || user?.email || "guest"}:${week}:${date}:${getQuestionKey(question)}`;
export function loadStoredEditableResponse(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { localStorage.removeItem(key); return null; } }
export const formatResponseDate = (date) => date ? new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`)) : "Saved response";
export const isSameQuestion = (response, question) => Boolean(response && question && (response.questionId === question._id || response.questionIdNumber === question.questionId || response.questionKey === question._id || response.questionText === question.text));
export const formatQuestionOption = (question) => `${question?.questionId ? `Question ${question.questionId}` : "Question"}: ${question?.text || "Untitled question"}`;
export function getDashboardQuestions(apiQuestions = []) {
  const questions = apiQuestions.map((question, index) => ({ ...question, questionId: question.questionId || index + 1 }));
  const keys = new Set(questions.map(getQuestionKey));
  return [...questions, ...fallbackQuestions.filter((question) => !keys.has(getQuestionKey(question)))].slice(0, 7);
}
export const getRelationshipTierLabel = (data, user) => ({ "1-3_years": "1-3 years together", "5-7_years": "5-7 years together" }[data?.relationshipTier || user?.relationshipTier] || `${data?.yearsTogether ?? user?.yearsTogether ?? 0} years together`);

const firstPresentValue = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim();

const getStoredPartnerName = () => {
  try {
    return localStorage.getItem("alignPartnerName")?.trim();
  } catch {
    return "";
  }
};

const getStoredUserName = () => {
  try {
    return localStorage.getItem("alignUserName")?.trim();
  } catch {
    return "";
  }
};

export const getUserDisplayName = (user) =>
  firstPresentValue(
    user?.userName,
    user?.firstName,
    user?.givenName,
    user?.name,
    user?.displayName,
    getStoredUserName()
  ) || "You";

export const getPartnerDisplayName = (user) =>
  firstPresentValue(
    user?.partnerName,
    user?.partnerFirstName,
    user?.spouseName,
    user?.spouseFirstName,
    user?.partner?.firstName,
    user?.partner?.name,
    getStoredPartnerName()
  ) || "Your partner";

export const getCoupleDisplayNames = (user) => ({
  userName: getUserDisplayName(user),
  partnerName: getPartnerDisplayName(user),
});
