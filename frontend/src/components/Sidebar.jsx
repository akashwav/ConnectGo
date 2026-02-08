import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import io from "socket.io-client";

var socket;

const Sidebar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { user, setSelectedChat, chats, setChats, selectedChat } = ChatState();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userInfo");
    setChats([]);
    setSelectedChat(null);
    navigate("/");
  };

  // 1. REQUEST NOTIFICATION PERMISSION ON LOAD
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${BASE_URL}/api/chat`, config);
        setChats(data);
      } catch (error) { console.error(error); }
    };
    fetchChats();
  }, [user]);

  // 2. REAL-TIME UPDATES + NOTIFICATIONS
  useEffect(() => {
    if (!user) return;

    socket = io(BASE_URL);
    socket.emit("setup", user);

    socket.on("message received", (newMessageReceived) => {
        
        // --- NOTIFICATION LOGIC START ---
        // Fire notification if:
        // 1. The window is hidden (minimized/other tab) OR
        // 2. We are not currently chatting with this person
        const isChatOpen = selectedChat && selectedChat._id === newMessageReceived.chat._id;
        
        if (document.hidden || !isChatOpen) {
            if (Notification.permission === "granted") {
                new Notification("ConnectGo", {
                    body: `${newMessageReceived.sender.name}: ${newMessageReceived.content}`,
                    icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg" // Your App Logo
                });
            }
        }
        // --- NOTIFICATION LOGIC END ---

        const chatExists = chats.find(c => c._id === newMessageReceived.chat._id);

        if (chatExists) {
            const updatedChats = chats.map(c => {
                if (c._id === newMessageReceived.chat._id) {
                    return { 
                        ...c, 
                        latestMessage: newMessageReceived,
                        hasNotification: selectedChat?._id !== c._id 
                    };
                }
                return c;
            });
            
            const chatToMove = updatedChats.find(c => c._id === newMessageReceived.chat._id);
            const otherChats = updatedChats.filter(c => c._id !== newMessageReceived.chat._id);
            setChats([chatToMove, ...otherChats]);

        } else {
            const newChat = newMessageReceived.chat;
            newChat.latestMessage = newMessageReceived;
            newChat.hasNotification = true;
            setChats([newChat, ...chats]);
        }
    });

    return () => {
        socket.disconnect(); 
    };
  }); 

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);
    if (!query) return setSearchResult([]);
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`${BASE_URL}/api/user?search=${query}`, config);
        setSearchResult(data);
    } catch (error) { console.error(error); }
  };

  const accessChat = async (userId) => {
    try {
      const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${BASE_URL}/api/chat`, { userId }, config);
      
      if (!chats.find((c) => c._id === data._id)) {
          setChats([data, ...chats]);
      }
      
      const updatedChat = { ...data, hasNotification: false };
      handleChatClick(updatedChat);
      
      setSearch("");
      setSearchResult([]);
    } catch (error) { console.error(error); }
  };

  const getSender = (loggedUser, users) => {
    if(!users || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };

  const formatTime = (dateString) => {
      if(!dateString) return "";
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleChatClick = (chat) => {
      const updatedChats = chats.map(c => c._id === chat._id ? { ...c, hasNotification: false } : c);
      setChats(updatedChats);

      if (selectedChat && selectedChat._id === chat._id) return;
      setSelectedChat(chat);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white border-r border-gray-200 select-none">
      
      {/* Header */}
      <div className="h-16 px-6 bg-white flex justify-between items-center border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
             <img
                alt="Logo"
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg"
                className="h-8 w-auto pointer-events-none"
              />
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">ConnectGo</h2>
        </div>
        <button 
            onClick={logout} 
            className="text-gray-400 hover:text-indigo-600 transition-colors"
            title="Logout"
        >
            <FaSignOutAlt className="text-lg" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 bg-white relative z-20 shrink-0">
         <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-400 text-sm" />
            </div>
            <input 
              type="text"
              className="block w-full rounded-md bg-white py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/80 focus:border-indigo-500 transition sm:text-sm sm:leading-6 select-text"
              placeholder="Search or start a new chat"
              value={search}
              onChange={handleSearch}
            />
         </div>

         {/* Results */}
         {searchResult.length > 0 && (
            <div className="absolute left-4 right-4 top-14 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
               {searchResult.map(u => (
                  <div key={u._id} onClick={() => accessChat(u._id)} className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-none">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">{u.name[0]}</div>
                    <div>
                        <p className="font-semibold text-sm text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
               ))}
            </div>
         )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {chats.map((chat) => (
          <div 
            key={chat._id} 
            onClick={() => handleChatClick(chat)}
            className={`px-4 py-3 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedChat?._id === chat._id ? "bg-indigo-50/60" : ""}`}
          >
            <div className="flex justify-between items-center">
                
                {/* LEFT SIDE: Avatar + Name + Message */}
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
                        {!chat.isGroupChat && getSender(user, chat.users)[0]} 
                    </div>
                    
                    <div className="flex flex-col">
                        <h3 className={`text-sm truncate ${chat.hasNotification ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                            {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                        </h3>
                        
                        {chat.latestMessage ? (
                            <p className={`text-xs truncate max-w-[180px] mt-0.5 ${chat.hasNotification ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                                {chat.latestMessage.sender._id === user._id ? "You: " : ""}
                                {chat.latestMessage.content}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-400 italic">Start a conversation</p>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Time + Badge */}
                <div className="flex flex-col items-end gap-1">
                    {chat.latestMessage && (
                        <span className={`text-[10px] ${chat.hasNotification ? "text-green-600 font-bold" : "text-gray-400"}`}>
                            {formatTime(chat.latestMessage.createdAt)}
                        </span>
                    )}
                    
                    {chat.hasNotification && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] text-white font-bold">1</span>
                        </div>
                    )}
                </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;