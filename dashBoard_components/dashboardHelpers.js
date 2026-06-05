const EDITABLE_RESPONSE_STORAGE_KEY = "alignEditableResponse";

const FALLBACK_DASHBOARD_QUESTIONS = [
  {
    _id: "fallback-question-1",
    questionId: 1,
    category: "Connection",
    text: "What made you feel most connected to your partner this week?",
  },
  {
    _id: "fallback-question-2",
    questionId: 2,
    category: "Communication",
    text: "What is one conversation you want to have with more honesty or tenderness?",
  },
  {
    _id: "fallback-question-3",
    questionId: 3,
    category: "Appreciation",
    text: "What is something your partner did recently that you appreciated?",
  },
  {
    _id: "fallback-question-4",
    questionId: 4,
    category: "Support",
    text: "Where could you use more support from your partner right now?",
  },
  {
    _id: "fallback-question-5",
    questionId: 5,
    category: "Growth",
    text: "What pattern would you like the two of you to improve together?",
  },
  {
    _id: "fallback-question-6",
    questionId: 6,
    category: "Repair",
    text: "Is there anything small you want to repair before it becomes bigger?",
  },
  {
    _id: "fallback-question-7",
    questionId: 7,
    category: "Intention",
    text: "What is one intention you want to bring into your relationship tomorrow?",
  },
];

export function getCurrentWeekIdentifier() {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNumber = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);

  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

export function getTodayIdentifier() {
  return new Date().toISOString().slice(0, 10);
}

export function formatLocalDashboardTime(date) {
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

function getSavedResponseId(saveResult) {
  const savedResponse =
    saveResult?.response ||
    saveResult?.checkInResponse ||
    saveResult?.data ||
    saveResult;

  return savedResponse?._id || savedResponse?.id || saveResult?.responseId || null;
}

export function buildEditableResponse(response, saveResult = {}, currentResponse = null) {
  const savedResponse =
    saveResult?.response ||
    saveResult?.checkInResponse ||
    saveResult?.data ||
    saveResult;
  const sourceResponse = {
    ...savedResponse,
    ...response,
  };

  return {
    ...currentResponse,
    id: getSavedResponseId(saveResult) || currentResponse?.id || null,
    questionId: sourceResponse.questionId,
    questionIdNumber: sourceResponse.questionIdNumber,
    questionKey: sourceResponse.questionKey,
    questionText: sourceResponse.questionText,
    category: sourceResponse.category,
    answerText: sourceResponse.answerText,
    moodScale: sourceResponse.moodScale,
    responseDate: sourceResponse.responseDate || currentResponse?.responseDate || getTodayIdentifier(),
    weekIdentifier: sourceResponse.weekIdentifier || currentResponse?.weekIdentifier,
    savedAt: currentResponse?.savedAt || savedResponse?.createdAt || savedResponse?.answeredAt || new Date().toISOString(),
  };
}

export function getEditableResponseStorageKey(user, weekIdentifier, question, responseDate) {
  const userKey = user?._id || user?.id || user?.email || "guest";
  const questionKey = question?._id || question?.questionId || question?.text || "daily-question";

  return `${EDITABLE_RESPONSE_STORAGE_KEY}:${userKey}:${weekIdentifier}:${responseDate}:${questionKey}`;
}

export function loadStoredEditableResponse(storageKey) {
  const storedResponse = localStorage.getItem(storageKey);
  if (!storedResponse) return null;

  try {
    return JSON.parse(storedResponse);
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function formatResponseDate(responseDate) {
  if (!responseDate) return "Saved response";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${responseDate}T12:00:00`));
}

export function isSameQuestion(response, question) {
  if (!response || !question) return false;

  return response.questionId === question._id ||
    response.questionIdNumber === question.questionId ||
    response.questionKey === question._id ||
    response.questionText === question.text;
}

export function getQuestionKey(question) {
  return question?._id || question?.questionId || question?.text || "daily-question";
}

export function formatQuestionOption(question) {
  const questionNumber = question?.questionId ? `Question ${question.questionId}` : "Question";

  return `${questionNumber}: ${question?.text || "Untitled question"}`;
}

export function getDashboardQuestions(apiQuestions = []) {
  const normalizedQuestions = apiQuestions.map((question, index) => ({
    ...question,
    questionId: question.questionId || index + 1,
  }));
  const existingKeys = new Set(normalizedQuestions.map((question) => getQuestionKey(question)));
  const fallbackQuestions = FALLBACK_DASHBOARD_QUESTIONS.filter((question) => {
    return !existingKeys.has(getQuestionKey(question));
  });

  return [...normalizedQuestions, ...fallbackQuestions].slice(0, 7);
}

export function getRelationshipTierLabel(questionData, user) {
  return {
    "1-3_years": "1-3 years together",
    "5-7_years": "5-7 years together",
    other: `${questionData?.yearsTogether ?? user?.yearsTogether ?? 0} years together`,
  }[questionData?.relationshipTier || user?.relationshipTier || "other"];
}
