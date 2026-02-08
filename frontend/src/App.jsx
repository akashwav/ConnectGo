import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

const SplashScreen = ({ visible }) => {
  return (
    <div
      className={`
        fixed inset-0 z-[9999] bg-slate-100 flex flex-col items-center justify-center
        select-none overflow-hidden touch-none cursor-wait
        transition-all duration-200 ease-out
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
      `}
    >
      <div className="flex flex-col items-center animate-pulse">
        <img
          alt="Logo"
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg"
          className="h-20 w-auto mb-4 pointer-events-none"
        />
        <h1 className="text-4xl font-bold text-slate-600 tracking-tight drop-shadow-2xl">
          ConnectGo
        </h1>
      </div>

      <div className="absolute bottom-10 text-indigo-400 text-sm font-medium tracking-wide">
        © 2026 ConnectGo™ · All rights reserved
      </div>
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(false), 1500); // start fade
    const t2 = setTimeout(() => setShowSplash(false), 1800); // remove

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="App min-h-screen bg-gray-100 text-gray-900 font-sans">
      
      {showSplash && <SplashScreen visible={visible} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;