// import React from "react";
// import { Link } from "react-router";
// const Header = () => {
//   return (

//      <>
//     <header className="navbar">
//       <a href="/" className="logo">
//         <span>
//           <i className="fa-solid fa-heart"></i>
//         </span>{" "}
//         ALIGN
//       </a>
    
//       <div className="auth-buttons">
//          <button className="theme-toggle" />
//         <span>
//           <i className="fa-solid fa-moon"></i>
//         </span> 
//          <a href="get-started.html">
//           <button className="btn-solid">Get Started</button>
//         </a>
//         <a href="sign-in.html">
//           <button className="btn-solid">Log-in </button>
//         </a> 
//       </div>
//     </header>
//   </>
//   )
 
// };

// export default Header;


import React from "react";
import { Link } from "react-router"; // or 'react-router-dom' depending on your package setup
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span>
          <i className="fa-solid fa-heart"></i>
        </span>{" "}
        ALIGN
      </Link>

      {/* Render your imported Navbar component here */}
      <Navbar />

      <div className="auth-buttons">
         {/* <button className="theme-toggle" />
        <span>
          <i className="fa-solid fa-moon"></i>
        </span>   */}
        
        {/* Fixed: Use React Router Links instead of raw .html file references */}
        <Link to="/get-started">
          <button className="btn-solid">Get Started</button>
        </Link>
        <Link to="/login">
          <button className="btn-solid">Log-in</button>
        </Link> 
      </div>
    </header>
  );
};

export default Header;