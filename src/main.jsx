// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import { createBrowserRouter,RouterProvider } from "react-router-dom";
// import "./index.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <div>Hello World</div>,
//   },
// ])

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     loader: rootLoader, // Data starts fetching IMMEDIATELY
//     children: [
//       {
//         path: "dashboard",
//         element: <Dashboard />,
//         loader: dashboardLoader,
//       },
//     ],
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);