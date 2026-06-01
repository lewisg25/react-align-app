import React from "react";
function HeaderBar() {
  return (
    <>
        <header className="header-bar">
      <button className="header-icon">✕</button>
      <h1 className="header-title">Daily Reflection</h1>
      <button className="header-icon">⋮</button>
    </header>
    </>

  );
}

export default HeaderBar;