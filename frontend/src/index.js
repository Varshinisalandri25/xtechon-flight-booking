import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";   // ✅ CORRECT IMPORT

import "./index.css";
import "./styles/global.css";
import "./styles/App.css";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
