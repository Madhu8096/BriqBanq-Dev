import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import "./compiled.css";
import "./index.css";

import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NotificationProvider>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AuthProvider>
    </NotificationProvider>
  </BrowserRouter>
);
