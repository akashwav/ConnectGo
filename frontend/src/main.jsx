import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from "react-router-dom"; // Import this
import ChatProvider from "./context/ChatProvider";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App here */}
      <ChatProvider> {/* Wrap here */}
        <App />
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>,
);