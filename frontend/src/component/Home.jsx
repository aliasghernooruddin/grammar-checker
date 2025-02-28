import React, { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("Login") || false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [sentence, setSentence] = useState("");
  const [output, setOutput] = useState("");  
  const [showOutput, setShowOutput] = useState(false)

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
      localStorage.setItem('Login', "true");
      setError(""); 
      setOutput("")
      setShowOutput(false)
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

    incorrectWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        highlightedSentence = highlightedSentence.replace(
            regex,
            `<span class="text-red-600 font-bold">${word}</span>` // Use "class" instead of "className"
        );
    });

    return highlightedSentence;
};


  const handleSubmit = async () => {
    if (!sentence) return setError("Please add a sentence.");

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/grammar-check`, { sentence });
      const formattedSentence = highlightErrors(sentence, response.data.incorrectWords);
      setOutput(formattedSentence);
      setShowOutput(true)
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
    <section className="flex justify-center items-center min-h-screen p-6 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900">
      <div className="w-full max-w-2xl">
        
        {!isLogin ? (
          <div className="p-10 rounded-2xl shadow-2xl bg-gray-900 border border-indigo-500/20">
            <h3 className="text-center text-3xl font-bold mb-8 text-white">Login Required</h3>
            
            <div className="mb-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={loginData.username}
                  onChange={(e)=>loginChange(e)}

                  className="w-full pl-10 p-4 border-2 border-gray-700 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={(e)=>loginChange(e)}
                  className="w-full pl-10 p-4 border-2 border-gray-700 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 mb-6 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center text-sm">
                {error}
              </div>
            )}
            
            <button
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none transition duration-300 ease-in-out font-medium text-lg shadow-lg"
              onClick={handleLogin}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        ) : (
          <div className="p-8 rounded-2xl shadow-2xl bg-gray-900 border border-indigo-500/20">
            <h1 className="text-center text-3xl font-bold mb-6 text-white">Grammar Checker</h1>
            
            {/* Output Section */}
            {showOutput && (
            <div className="mb-6 p-6 border-2 border-indigo-600/30 rounded-lg bg-indigo-900/20 text-white">
                <h2 className="text-xl font-semibold mb-2 text-indigo-300">Output</h2>
                 <p dangerouslySetInnerHTML={{ __html: output }} />
            </div>

            )}

            <div className="mb-6">
              <div className="relative">
              <input
                type="text"
                placeholder="Enter sentence here"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 pr-12 border-2 border-gray-700 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 "
              />
             
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-900/40 border border-red-500 rounded-lg text-red-200 text-center text-sm">
                {error}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 focus:outline-none transition duration-300 text-sm"
                onClick={
                    ()=>{
                        setIsLogin(false) 
                        localStorage.setItem("Login","")
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




