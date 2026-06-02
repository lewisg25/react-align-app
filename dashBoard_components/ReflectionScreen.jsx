import React, { useEffect, useState } from "react";

function ReflectionScreen({
  question,
  editableResponse = null,
  onSave,
  onUpdate,
  onDelete,
  isLocked = false,
  lockedMessage = "",
}) {
  const [response, setResponse] = useState("");
  const [moodScale, setMoodScale] = useState(3);
  const [saveStatus, setSaveStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionText =
    question?.text ||
    "Choose a reflection question to begin your check-in.";
  const category = question?.category || "Daily Reflection";
  const hasEditableResponse = Boolean(editableResponse);
  const isFormLocked = isLocked && !hasEditableResponse;

  useEffect(() => {
    if (!editableResponse) {
      setResponse("");
      setMoodScale(3);
      return;
    }

    setResponse(editableResponse.answerText || "");
    setMoodScale(editableResponse.moodScale || 3);
  }, [editableResponse]);

  const handleSave = async () => {
    if (isFormLocked) {
      setSaveStatus(lockedMessage || "This response can no longer be changed.");
      return;
    }

    if (!response.trim() || !question) {
      setSaveStatus("Write a response before saving.");
      return;
    }

    setSaveStatus("Saving...");
    setIsSubmitting(true);

    try {
      const payload = {
        responseId: editableResponse?.id,
        questionId: question._id,
        questionIdNumber: question.questionId,
        questionKey: question._id || question.questionId || question.text,
        questionText,
        category,
        answerText: response,
        moodScale,
      };
      const saveResult = hasEditableResponse
        ? await onUpdate(payload)
        : await onSave(payload);

      setSaveStatus(saveResult?.message || (hasEditableResponse ? "Your response was updated." : "Thank you for your response."));
    } catch (error) {
      setSaveStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!hasEditableResponse || isFormLocked) return;
    if (!window.confirm("Delete this response?")) return;

    setSaveStatus("Deleting...");
    setIsSubmitting(true);

    try {
      const deleteResult = await onDelete(editableResponse);
      setResponse("");
      setMoodScale(3);
      setSaveStatus(deleteResult?.message || "Your response was deleted.");
    } catch (error) {
      setSaveStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Question Card Element */}
      <div className="reflection-card">
        <p className="dashboard-kicker">{category}</p>
        <h2 className="card-question">{questionText}</h2>
        <p className="card-prompt">
          {isFormLocked
            ? lockedMessage || "This response can no longer be changed."
            : hasEditableResponse
            ? "You can update or delete your saved response."
            : "Take a deep breath. Answer honestly, then invite your partner into the conversation."}
        </p>
      </div>


      <textarea
        className="response-textarea"
        placeholder={isFormLocked ? lockedMessage || "Select a saved response to edit." : "Write your reflection here..."}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isFormLocked || isSubmitting}
      />
      <div className="response-actions">
        <label htmlFor="mood-scale">Mood: {moodScale}</label>
        <input
          id="mood-scale"
          type="range"
          min="1"
          max="5"
          value={moodScale}
          onChange={(event) => setMoodScale(Number(event.target.value))}
          disabled={isFormLocked || isSubmitting}
        />
        <div className="response-button-group">
          <button type="button" className="btn-submit" onClick={handleSave} disabled={isFormLocked || isSubmitting}>
            {isSubmitting ? "Saving..." : hasEditableResponse ? "Update Response" : "Save Response"}
          </button>
          {hasEditableResponse && (
            <button type="button" className="btn-cancel response-delete" onClick={handleDelete} disabled={isSubmitting}>
              Delete
            </button>
          )}
        </div>
      </div>
      {saveStatus && <p className="response-notification">{saveStatus}</p>}
    </>
  );
}

export default ReflectionScreen;
