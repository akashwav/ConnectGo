import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

import ChatProvider from "./context/ChatProvider";

// ✅ choose router based on platform
const Router = Capacitor.isNativePlatform()
  ? HashRouter     // Android / iOS
  : BrowserRouter; // Web

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ChatProvider>
        <App />
      </ChatProvider>
    </Router>
  </React.StrictMode>,
);
