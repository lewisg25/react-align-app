import { useEffect, useMemo, useState } from "react";

const lockedFallback = "This response can no longer be changed.";
const emptyPrompt = "Choose a reflection question to begin your check-in.";

export function useReflectionForm({ editableResponse, isLocked, lockedMessage, onDelete, onSave, onUpdate, question }) {
  const [response, setResponse] = useState("");
  const [moodScale, setMoodScale] = useState(3);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasEditableResponse = Boolean(editableResponse);
  const isFormLocked = isLocked && !hasEditableResponse;
  const questionText = question?.text || emptyPrompt;
  const category = question?.category || "Daily Reflection";

  useEffect(() => {
    setResponse(editableResponse?.answerText || "");
    setMoodScale(editableResponse?.moodScale || 3);
  }, [editableResponse]);

  const payload = useMemo(() => ({
    responseId: editableResponse?.id,
    questionId: question?._id,
    questionIdNumber: question?.questionId,
    questionKey: question?._id || question?.questionId || question?.text,
    questionText,
    category,
    answerText: response,
    moodScale,
  }), [category, editableResponse?.id, moodScale, question, questionText, response]);

  const runAction = async (message, action) => {
    setSaveStatus(message);
    setIsSubmitting(true);
    try {
      const result = await action();
      setSaveStatus(result?.message || "Your response was saved.");
      return result;
    } catch (error) {
      setSaveStatus(error.message);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (isFormLocked) return setSaveStatus(lockedMessage || lockedFallback);
    if (!response.trim() || !question) return setSaveStatus("Write a response before saving.");
    const action = () => (hasEditableResponse ? onUpdate(payload) : onSave(payload));
    const result = await runAction("Saving...", action);
    if (result && !result.message) setSaveStatus(hasEditableResponse ? "Your response was updated." : "Thank you for your response.");
  };

  const handleDelete = async () => {
    if (!hasEditableResponse || isFormLocked || !window.confirm("Delete this response?")) return;
    const result = await runAction("Deleting...", () => onDelete(editableResponse));
    if (result) {
      setResponse("");
      setMoodScale(3);
      if (!result.message) setSaveStatus("Your response was deleted.");
    }
  };

  return {
    canDelete: hasEditableResponse,
    category,
    handleDelete,
    handleSave,
    isDisabled: isFormLocked || isSubmitting,
    isSubmitting,
    moodScale,
    placeholder: isFormLocked ? lockedMessage || "Select a saved response to edit." : "Write your reflection here...",
    prompt: isFormLocked ? lockedMessage || lockedFallback : hasEditableResponse ? "You can update or delete your saved response." : "Take a deep breath. Answer honestly, then invite your partner into the conversation.",
    questionText,
    response,
    saveButtonLabel: isSubmitting ? "Saving..." : hasEditableResponse ? "Update Response" : "Save Response",
    saveStatus,
    setMoodScale,
    setResponse,
  };
}
