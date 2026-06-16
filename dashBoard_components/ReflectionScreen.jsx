import { useReflectionForm } from "./useReflectionForm";

const moodOptions = [
  { value: 1, emoji: "😢", label: "Sad" },
  { value: 2, emoji: "😟", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😄", label: "Really happy" },
];

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
        <fieldset className="mood-radio-group" disabled={form.isDisabled}>
          <legend>Mood</legend>
          <div className="mood-options" aria-label="Mood from sad to really happy">
            {moodOptions.map((mood) => (
              <label
                className={
                  mood.value === form.moodScale
                    ? "mood-option active"
                    : "mood-option"
                }
                key={mood.value}
              >
                <input
                  type="radio"
                  name="mood-scale"
                  value={mood.value}
                  checked={mood.value === form.moodScale}
                  onChange={() => form.setMoodScale(mood.value)}
                />
                <span className="mood-emoji" aria-hidden="true">{mood.emoji}</span>
                <span className="mood-value">{mood.value}</span>
                <span className="mood-label">{mood.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
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
