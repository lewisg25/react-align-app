import { useState } from "react";

function ResponseInput() {
  const [response, setResponse] = useState("");

  return (
    <>
      <div className="response-container">
      <textarea
        className="response-textarea"
        placeholder="I remember when we..."
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />
    </div>
    </>
  
  );
}

export default ResponseInput;