import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import { ChatState } from "../context/ChatProvider";

const HomePage = ({ splashActive }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // 🔹 prevent any focus during splash
  useEffect(() => {
    if (splashActive) {
      document.activeElement?.blur();
    }
  }, [splashActive]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
      navigate("/chats");
    }
    setLoadingAuth(false);
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "signup") {
        await axios.post(`${BASE_URL}/api/user`, { name, email, password });
        alert("Registration Successful! Please Login.");
        setActiveTab("login");
        setLoading(false);
      } else {
        const { data } = await axios.post(
          `${BASE_URL}/api/user/login`,
          { email, password }
        );

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

  if (loadingAuth) return null;

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white h-screen">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="ConnectGo"
          src="https://upload.wikimedia.org/wikipedia/commons/5/51/IMessage_logo.svg"
          className="mx-auto w-14 h-14"
        />
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          {activeTab === "login" ? "ConnectGo" : "Create your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        {/* 🔹 disable all inputs during splash */}
        <fieldset disabled={splashActive}>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">

            {activeTab === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md bg-slate-100 px-3 py-1.5"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md bg-slate-100 px-3 py-1.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md bg-slate-100 px-3 py-1.5"
              />
            </div>

            {activeTab === "login" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="ml-2 text-sm">Remember me</label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              {loading ? "Processing..." :
               activeTab === "login" ? "Sign in" : "Sign up"}
            </button>

          </form>
        </fieldset>

        <p className="mt-10 text-center text-sm text-gray-500">
          {activeTab === "login" ? "Not a member? " : "Already a member? "}
          <button
            onClick={() =>
              setActiveTab(activeTab === "login" ? "signup" : "login")
            }
            className="font-semibold text-indigo-600"
          >
            {activeTab === "login" ? "Register Now" : "Sign In"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default HomePage;
