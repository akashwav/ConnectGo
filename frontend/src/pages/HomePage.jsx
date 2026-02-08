import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { ChatState } from "../context/ChatProvider";

const HomePage = ({ splashActive }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true); // New state to prevent flash
  const navigate = useNavigate();
  const { setUser } = ChatState(); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true); // Default true

  useEffect(() => {
    if (splashActive) {
      document.activeElement?.blur();
    }
  }, [splashActive]);

  // Check for existing login on mount
  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
          setUser(userInfo);
          navigate("/chats");
      }
      setLoadingAuth(false); // Auth check done
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        await axios.post(`${BASE_URL}/api/user`, { name, email, password });
        alert("Registration Successful! Please Login.");
        setActiveTab("login");
        setLoading(false);
      } else {
        const { data } = await axios.post(`${BASE_URL}/api/user/login`, { email, password });
        
        // Save to Storage
        // If Remember Me is Checked -> LocalStorage (Persistent)
        // If Unchecked -> SessionStorage (Clears on close) - *Optional complexity, sticking to LocalStorage for better UX*
        localStorage.setItem("userInfo", JSON.stringify(data));
        
        setUser(data);
        setLoading(false);
        navigate("/chats");
      }
    } catch (error) {
        setLoading(false);
        alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // Prevent Login screen flash if we are about to redirect
  if (loadingAuth) return null;

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="ConnectGo"
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg"
          className="mx-auto w-14 h-14"
        />
        <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {activeTab === 'login' ? "ConnectGo" : "Create your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <fieldset disabled={splashActive}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">Name</label>
                <div className="mt-2">
                  <input id="name" type="text" placeholder="eg. John" required value={name} onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-md bg-slate-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email Address</label>
              <div className="mt-2">
                <input id="email" type="email" placeholder="eg. john@yahoo.com" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-slate-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
              </div>
              <div className="mt-2">
                <input id="password" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-slate-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            
            {/* Remember Me Checkbox */}
            {activeTab === 'login' && (
              <div className="flex items-center">
                  <input 
                      id="remember-me" 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                  </label>
              </div>
            )}

            <div>
              <button type="submit" disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all"
              >
                {loading ? "Processing..." : activeTab === 'login' ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>
        </fieldset>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {activeTab === 'login' ? "Not a member? " : "Already a member? "}
          <button 
            onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {activeTab === 'login' ? "Register Now" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default HomePage;