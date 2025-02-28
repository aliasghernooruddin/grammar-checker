import React, { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("Login") || false
  );
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [sentence, setSentence] = useState("");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      return setError("Please fill in both fields.");
    }

    setIsLoading(true);
    try {
      await axios.post(`${BASE_URL}/login`, loginData);
      setLoginData({ username: "", password: "" });
      setIsLogin(true);
      localStorage.setItem("Login", "true");
      setError("");
      setOutput("");
      setShowOutput(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data.error);
      } else {
        setError("Error while login, please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const highlightErrors = (sentence, incorrectWords) => {
    if (!incorrectWords || incorrectWords.length === 0) return sentence;

    let highlightedSentence = sentence;

    incorrectWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      highlightedSentence = highlightedSentence.replace(
        regex,
        `<span class="text-red-600 font-bold">${word}</span>`
      );
    });

    return highlightedSentence;
  };

  const handleSubmit = async () => {
    if (!sentence) return setError("Please add a sentence.");

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/grammar-check`, {
        sentence,
      });
      const formattedSentence = highlightErrors(
        sentence,
        response.data.incorrectWords
      );
      setOutput(formattedSentence);
      setShowOutput(true);
      setSentence("");
      setError("");
    } catch (error) {
      setError("Error during grammar check, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen p-6 bg-amber-50">
      <div className="w-full max-w-lg">
        {!isLogin ? (
          <div className="bg-white flex rounded-4xl w-full max-w-sm overflow-hidden drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] mx-auto">
            <div className="bg-white p-10 w-full">
              <h3 className="text-2xl font-semibold mb-8 text-purple-700 text-center">
                Sign In
              </h3>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="testuser"
                  name="username"
                  value={loginData.username}
                  onChange={loginChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="testuser"
                  name="password"
                  value={loginData.password}
                  onChange={loginChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              {error && (
                <div className="p-3 mb-6 bg-red-100 border border-red-400 rounded-md text-red-700 text-center text-sm">
                  {error}
                </div>
              )}
              <button
                className="w-full py-3 bg-purple-700 text-white rounded-md hover:bg-purple-800 focus:outline-none transition duration-300 font-medium"
                onClick={handleLogin}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging In...
                  </span>
                ) : (
                  "LOGIN"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-4">
            {showOutput && (
              <div className="mb-6 p-6 bg-gray-100 rounded-lg drop-shadow-md">
                <h2 className="text-gray-600 font-medium mb-2">Output</h2>
                <p
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              </div>
            )}
            <div className="mb-6">
              <textarea
                placeholder="Enter a sentence and press Enter..."
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 min-h-[120px] resize-none"
              />
            </div>
            {error && (
              <div className="p-3 mb-4 bg-red-100 border border-red-300 rounded-lg text-red-700 text-center text-sm">
                {error}
              </div>
            )}
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-300 text-sm"
                onClick={() => {
                  setIsLogin(false);
                  localStorage.setItem("Login", "");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
