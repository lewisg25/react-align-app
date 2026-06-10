import {
  getCoupleDisplayNames,
  getQuestionKey,
  getRelationshipTierLabel,
} from "./dashboardHelpers";
import { useDashboardModel } from "./useDashboardModel";

export function useDashboard() {
  const model = useDashboardModel();
  const isResponseLocked = !model.selectedDateIsToday && !model.editableResponse;
  const yearsMarried = Number(model.user?.yearsTogether);
  const coupleNames = getCoupleDisplayNames(model.user);

  return {
    coupleNames,
    editableResponse: model.editableResponse,
    error: model.error,
    firstName: coupleNames.userName,
    handleDeleteResponse: model.handleDeleteResponse,
    handleLogout: model.handleLogout,
    handleSaveResponse: model.handleSaveResponse,
    handleUpdateResponse: model.handleUpdateResponse,
    isResponseLocked,
    localDateTime: model.localDateTime,
    lockedMessage: isResponseLocked
      ? "No saved response was found for this day."
      : model.questionData?.message,
    marriageYearsLabel: Number.isFinite(yearsMarried)
      ? `${yearsMarried} year${yearsMarried === 1 ? "" : "s"}`
      : "Not set",
    questionPanel: {
      answeredToday: Boolean(model.questionData?.answeredToday),
      isLoadingQuestions: model.isLoadingQuestions,
      questions: model.questions,
      tierLabel: getRelationshipTierLabel(model.questionData, model.user),
    },
    questionPicker: {
      onQuestionSelect: model.handleQuestionSelect,
      questions: model.questions,
      selectedQuestion: model.selectedQuestion,
    },
    reflectionKey: getQuestionKey(model.selectedQuestion),
    responseHistoryPanel: {
      onSelectResponseDate: model.setSelectedResponseDate,
      savedResponses: model.savedResponsesForSelectedQuestion,
      selectedResponseDate: model.selectedResponseDate,
      todayIdentifier: model.todayIdentifier,
    },
    selectedQuestion: model.selectedQuestion,
    streak: model.streak,
    summary: model.summary,
  };
}
