import { useState, useEffect } from "react";
import { generateCommitMessage } from "../utils/gemini";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    const stored = localStorage.getItem("commit_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const msg = await generateCommitMessage(input);
    setResult(msg);
    const newHistory = [msg, ...history.slice(0, 9)];
    setHistory(newHistory);
    localStorage.setItem("commit_history", JSON.stringify(newHistory));
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900"
      } min-h-screen w-full flex flex-col items-center justify-start p-4 transition-colors`}
    >
      {/* Header */}
      <header className="w-full max-w-5xl py-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">⚡</span>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">GitCommitPro</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "generate" ? (darkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white") : (darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
          >
            Generate
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === "history" ? (darkMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white") : (darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
          >
            History
          </button>
          <button
            onClick={toggleTheme}
            className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} ml-2 px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 flex items-center`}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="w-full max-w-5xl flex flex-col space-y-6 mt-8">
        {activeTab === "generate" && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Input */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6">
              <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800/60" : "bg-white/80"} backdrop-blur-md border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">✍️</span>
                  <span>Describe Your Changes</span>
                </h3>
                <textarea
                  rows={8}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`w-full p-5 rounded-xl border ${
                    darkMode
                      ? "bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white/90 border-gray-200 text-black placeholder-gray-400"
                  } resize-none outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                  placeholder="Example: Added user authentication with email verification, fixed navbar responsiveness issues on mobile, updated documentation with new API endpoints"
                />
                <div className="mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 w-full"
                  >
                    <span>{loading ? '⏳' : '✨'}</span>
                    <span>{loading ? "Generating..." : "Generate Commit Message"}</span>
                  </button>
                </div>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>Enter a description of your code changes and we'll generate a professional commit message following best practices.</p>
                </div>
              </div>
            </div>

            {/* Right Column - Result */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6">
              <div className={`p-6 rounded-2xl shadow-lg ${result ? (darkMode ? "bg-indigo-900/20" : "bg-indigo-50/80") : (darkMode ? "bg-gray-800/60" : "bg-white/80")} backdrop-blur-md border ${result ? (darkMode ? "border-indigo-500/30" : "border-indigo-300") : (darkMode ? "border-gray-700" : "border-gray-200")} h-full`}>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🚀</span>
                  <span>Your Commit Message</span>
                </h3>
                
                {result ? (
                  <div className="mt-2">
                    <pre className={`text-base whitespace-pre-wrap break-words font-mono p-5 rounded-lg ${darkMode ? "bg-gray-900/70" : "bg-white/90"} border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-inner`}>
                      {result}
                    </pre>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${copied ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                      >
                        <span>{copied ? '✅' : '📋'}</span>
                        <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🔮</div>
                    <p className="text-lg mb-2">Your commit message will appear here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fill out the form on the left and click generate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && history.length > 0 && (
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800/60" : "bg-white/80"} backdrop-blur-md border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="text-2xl font-bold">Your Commit History</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-xl border ${darkMode ? "bg-gray-900/50 border-gray-700" : "bg-white/90 border-gray-200"} hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-800"}`}>Commit #{history.length - i}</span>
                    </div>
                    <button 
                      onClick={() => navigator.clipboard.writeText(msg)}
                      className={`text-xs px-2 py-1 rounded ${darkMode ? "hover:bg-gray-700 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"} transition-colors`}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap break-words font-mono mt-2">
                    {msg}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty History State */}
        {activeTab === "history" && history.length === 0 && (
          <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800/60" : "bg-white/80"} backdrop-blur-md border ${darkMode ? "border-gray-700" : "border-gray-200"} text-center`}>
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">No Commit History Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Generate your first commit message to see it here</p>
            <button
              onClick={() => setActiveTab("generate")}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 mx-auto"
            >
              <span>✨</span>
              <span>Create Your First Commit</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
