import React, { useState } from "react";

function ReflectionScreen({ question, onSave, isLocked = false, lockedMessage = "" }) {
  const [response, setResponse] = useState("");
  const [moodScale, setMoodScale] = useState(3);
  const [saveStatus, setSaveStatus] = useState("");
  const questionText =
    question?.text ||
    "Choose a reflection question to begin your check-in.";
  const category = question?.category || "Daily Reflection";

  const handleSave = async () => {
    if (isLocked) {
      setSaveStatus(lockedMessage || "Come back tomorrow for your next question.");
      return;
    }

    if (!response.trim() || !question) {
      setSaveStatus("Write a response before saving.");
      return;
    }

    setSaveStatus("Saving...");

    try {
      const saveResult = await onSave({
        questionId: question._id,
        questionIdNumber: question.questionId,
        questionKey: question._id || question.questionId || question.text,
        questionText,
        category,
        answerText: response,
        moodScale,
      });
      setSaveStatus(saveResult?.message || "Thank you for your response.");
    } catch (error) {
      setSaveStatus(error.message);
    }
  };

  return (
    <>
      {/* Question Card Element */}
      <div className="reflection-card">
        <p className="dashboard-kicker">{category}</p>
        <h2 className="card-question">{questionText}</h2>
        <p className="card-prompt">
          {isLocked ? lockedMessage : "Take a deep breath. Answer honestly, then invite your partner into the conversation."}
        </p>
      </div>


      <textarea
        className="response-textarea"
        placeholder={isLocked ? "You can answer again tomorrow." : "Write your reflection here..."}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isLocked}
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
          disabled={isLocked}
        />
        <button type="button" className="btn-submit" onClick={handleSave} disabled={isLocked}>
          {isLocked ? "Completed Today" : "Save Response"}
        </button>
      </div>
      {saveStatus && <p className="response-notification">{saveStatus}</p>}
    </>
  );
}

export default ReflectionScreen;
