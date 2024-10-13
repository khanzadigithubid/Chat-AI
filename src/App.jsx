import { useState } from "react";
import "./App.css";
import axios from "axios";
import "./index.css";
import { FiSend } from "react-icons/fi";
import { FaUserCircle, FaRobot } from "react-icons/fa";

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question) return;

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setQuestion("");
    setGeneratingAnswer(true);

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBCrxtlDbz9h9pYPwaNs0uaDCtCYxG93mw",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const answerText =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setMessages([...newMessages, { role: "bot", content: answerText }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages,
        { role: "bot", content: "Sorry - Something went wrong. Please try again!" },
      ]);
    }

    setGeneratingAnswer(false);
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-900 to-white"}`}>
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 text-white bg-blue-600 p-2 rounded-full shadow-lg transition transform hover:scale-110"
      >
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
      <div className={`w-full max-w-4xl flex flex-col h-[90vh] rounded-3xl shadow-2xl ${darkMode ? "bg-gray-800" : "bg-white/10"} p-6 overflow-hidden backdrop-blur-lg border border-white/20 transition-all duration-300`}>
        <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${darkMode ? "text-white" : "text-gray-800"} mb-6 flex items-center gap-4 bg-gradient-to-r from-blue-800 to-teal-900 p-3 rounded-full shadow-lg transform hover:scale-105 transition duration-300 justify-center`}>
          <FaRobot className={`text-3xl sm:text-4xl md:text-5xl ${darkMode ? "text-white" : "text-gray-900"}`} />
          Chat AI
        </h1>
        <div className={`flex-grow w-full overflow-y-auto p-4 rounded-3xl ${darkMode ? "bg-gray-700" : "bg-white/30"} shadow-inner backdrop-blur-md border border-gray-300 transition-all duration-300`}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 my-3 ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
            >
              {msg.role === "user" ? (
                <FaUserCircle className="text-indigo-400 text-3xl sm:text-4xl md:text-5xl" />
              ) : (
                <FaRobot className="text-teal-300 text-3xl sm:text-4xl md:text-5xl" />
              )}
              <div
                className={`p-3 md:p-4 rounded-2xl w-fit max-w-full md:max-w-xs shadow-lg transition-all duration-300 transform animate-pulse ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-400 to-purple-600 text-white"
                    : "bg-gradient-to-r from-green-200 to-blue-400 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={generateAnswer} className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4">
          <textarea
            required
            className={`flex-grow border border-gray-600 rounded-3xl min-h-[50px] p-3 transition-all duration-300 focus:border-purple-500 focus:shadow-xl resize-none backdrop-blur-md ${darkMode ? "bg-gray-800 text-white" : "bg-white/10 text-black"}`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            rows={2}
          ></textarea>
          <button
            type="submit"
            className={`bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg flex items-center justify-center ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={generatingAnswer}
          >
            <FiSend className="text-2xl" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
