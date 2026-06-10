import { useReflectionForm } from "./useReflectionForm";

function ReflectionScreen({
  coupleNames,
  question,
  editableResponse = null,
  onSave,
  onUpdate,
  onDelete,
  isLocked = false,
  lockedMessage = "",
}) {
  const form = useReflectionForm({
    editableResponse,
    isLocked,
    lockedMessage,
    onDelete,
    onSave,
    onUpdate,
    question,
  });

  return (
    <>
      <div className="reflection-card">
        <p className="dashboard-kicker">{form.category}</p>
        <p className="reflection-couple-line">
          For {coupleNames.userName} and {coupleNames.partnerName}
        </p>
        <h2 className="card-question">{form.questionText}</h2>
        <p className="card-prompt">{form.prompt}</p>
      </div>

      <textarea
        className="response-textarea"
        placeholder={form.placeholder}
        value={form.response}
        onChange={(event) => form.setResponse(event.target.value)}
        disabled={form.isDisabled}
      />

      <div className="response-actions">
        <label htmlFor="mood-scale">Mood: {form.moodScale}</label>
        <input
          id="mood-scale"
          type="range"
          min="1"
          max="5"
          value={form.moodScale}
          onChange={(event) => form.setMoodScale(Number(event.target.value))}
          disabled={form.isDisabled}
        />
        <div className="response-button-group">
          <button type="button" className="btn-submit" onClick={form.handleSave} disabled={form.isDisabled}>
            {form.saveButtonLabel}
          </button>
          {form.canDelete && (
            <button type="button" className="btn-cancel response-delete" onClick={form.handleDelete} disabled={form.isSubmitting}>
              Delete
            </button>
          )}
        </div>
      </div>

      {form.saveStatus && <p className="response-notification">{form.saveStatus}</p>}
    </>
  );
}

export default ReflectionScreen;
