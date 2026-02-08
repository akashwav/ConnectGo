import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import io from "socket.io-client";
import BASE_URL from "../config";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";

var socket, selectedChatCompare;

const ChatWindow = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChatList = (latestMsg, isUnread = false) => {
    const updatedChats = chats.map((c) => {
      if (c._id === latestMsg.chat._id) {
        return {
          ...c,
          latestMessage: latestMsg,
          hasNotification: isUnread ? true : false,
        };
      }
      return c;
    });

    const chatToMove = updatedChats.find((c) => c._id === latestMsg.chat._id);
    const otherChats = updatedChats.filter((c) => c._id !== latestMsg.chat._id);

    if (chatToMove) {
      setChats([chatToMove, ...otherChats]);
    }
  };

  useEffect(() => {
    socket = io(BASE_URL);
    socket.emit("setup", user);
    return () => socket.disconnect();
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      setTimeout(scrollToBottom, 100);

      const updatedChats = chats.map((c) =>
        c._id === selectedChat._id ? { ...c, hasNotification: false } : c,
      );
      setChats(updatedChats);
    } catch (error) {
      console.error("Error fetching messages");
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
  if (!socket) return;

  const messageHandler = (newMessageRecieved) => {
    setMessages(prevMessages => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        // message for another chat → update list only
        updateChatList(newMessageRecieved, true);
        return prevMessages;
      }

      // message for current open chat
      updateChatList(newMessageRecieved, false);
      setTimeout(scrollToBottom, 100);

      return [...prevMessages, newMessageRecieved];
    });
  };

  socket.on("message received", messageHandler);

  return () => {
    socket.off("message received", messageHandler);
  };

}, [selectedChat, chats]); // ✅ keep deps

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        inputRef.current?.focus();

        const { data } = await axios.post(
          `${BASE_URL}/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config,
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        updateChatList(data, false);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        alert("Failed to send");
      }
    }
  };

  const getSender = (loggedUser, users) => {
    if (!users || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50 text-center p-10 select-none">
        <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
          <img
            alt="Logo"
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg"
            className="h-10 w-auto pointer-events-none"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">ConnectGo</h1>
        <p className="text-gray-500 mt-2 max-w-sm">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    // Flex Column Layout: Ensures precise stacking without absolute positioning glitches
    <div className="flex flex-col w-full h-[100dvh] bg-[#efeae2] select-none overflow-hidden">
      {/* 1. HEADER - shrink-0 prevents it from being squashed */}
      <div className="sticky top-0 h-[64px] shrink-0 px-4 bg-white border-b border-gray-200 flex items-center shadow-sm z-30">
        <button
          className="md:hidden mr-4 text-gray-500 hover:text-indigo-600 p-2"
          onClick={() => setSelectedChat(null)}
        >
          <FaArrowLeft />
        </button>

        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3 border border-indigo-200">
          {!selectedChat.isGroupChat && getSender(user, selectedChat.users)[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate text-sm">
            {!selectedChat.isGroupChat
              ? getSender(user, selectedChat.users)
              : selectedChat.chatName}
          </h3>
        </div>
      </div>

      {/* 2. MESSAGES AREA - flex-1 takes all available height, scrolls internally */}
      <div className="flex-1 overflow-y-auto overscroll-y-contain touch-pan-y px-4 py-4 space-y-4 bg-slate-100 bg-repeat opacity-100">
        {loading ? (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`flex ${m.sender._id === user._id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                    max-w-[85%] md:max-w-[60%] px-3 py-2 rounded-lg text-sm relative shadow-sm select-text 
                    ${
                      m.sender._id === user._id
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"
                    }
                  `}
              >
                <p className="leading-relaxed break-words text-[15px]">
                  {m.content}
                </p>
                <div
                  className={`text-[10px] mt-1 text-right select-none ${m.sender._id === user._id ? "text-indigo-200" : "text-gray-400"}`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT AREA - shrink-0 ensures it stays at bottom */}
      <div className="min-h-[72px] shrink-0 bg-white border-t border-gray-200 z-20 flex items-center px-2 pb-safe env(safe-area-inset-bottom)">
        <div className="flex items-center gap-2 w-full p-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 block rounded-md border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500 transition sm:text-sm sm:leading-6 select-text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={sendMessage}
          />
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={sendMessage}
            className="rounded-full bg-indigo-600 p-3 text-white shadow-sm hover:bg-indigo-500 transition-all flex-shrink-0"
          >
            <FaPaperPlane className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
