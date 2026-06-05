function QuestionCard() {
  return (
    <div className="reflection-card">
      <span className="card-leaf-icon">🍃</span>

      <div className="card-badge-wrapper">
        <div className="card-badge">
          <span className="badge-icon">❓</span>
        </div>
      </div>

      <h2 className="card-question">
        If you could relive one memory with your partner today, which would it be and why?
      </h2>

      <p className="card-prompt">
        Take a deep breath. Focus on a moment that brings you quiet joy.
      </p>
    </div>
  );
}

export default QuestionCard;
