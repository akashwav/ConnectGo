import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
  const { selectedChat } = ChatState();
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = () => setIsResizing(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.max(250, Math.min(e.clientX, 600));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    // fixed inset-0 = Locks layout to viewport exactly
    <div className="fixed inset-0 flex w-full h-full overflow-hidden bg-white">
      
      {/* SIDEBAR */}
      <div 
        className={`
            h-full flex-col border-r border-gray-200 bg-white
            ${selectedChat ? "hidden md:flex" : "flex w-full md:w-auto"}
        `}
        style={{ width: window.innerWidth >= 768 ? sidebarWidth : '100%' }}
      >
        <Sidebar />
      </div>

      {/* RESIZER */}
      <div
        className={`hidden md:flex w-1 h-full cursor-col-resize hover:bg-indigo-500 active:bg-indigo-600 transition-colors z-50 select-none
            ${isResizing ? "bg-indigo-600" : "bg-gray-100"}`}
        onMouseDown={startResizing}
      />

      {/* CHAT WINDOW */}
      <div 
        className={`
            flex-1 h-full justify-center bg-gray-50 relative
            ${selectedChat ? "flex" : "hidden md:flex"}
        `}
      >
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;