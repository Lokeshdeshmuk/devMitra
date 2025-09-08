import { useState, useEffect } from "react";
import { generateCommitMessage } from "../utils/GitMessage";

export default function GitMessage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white  w-full flex flex-col items-center justify-start p-4 transition-colors">
      <main className="w-full max-w-5xl flex flex-col space-y-6 mt-8">
        {activeTab === "generate" && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6">
              <div className="p-6 rounded-2xl shadow-lg bg-gray-800/60 backdrop-blur-md border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">✍️</span>
                  <span>Describe Your Changes</span>
                </h3>
                <textarea
                  rows={8}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-5 rounded-xl border bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 resize-none outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="Example: Added user authentication with email verification, fixed navbar responsiveness issues on mobile, updated documentation with new API endpoints"
                />
                <div className="mt-4">
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 w-full"
                  >
                    <span>{loading ? "⏳" : "✨"}</span>
                    <span>
                      {loading ? "Generating..." : "Generate Commit Message"}
                    </span>
                  </button>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  <p>
                    Enter a description of your code changes and we'll generate
                    a professional commit message following best practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6">
              <div
                className={`p-6 rounded-2xl shadow-lg ${
                  result
                    ? "bg-indigo-900/20 border border-indigo-500/30"
                    : "bg-gray-800/60 border border-gray-700"
                } backdrop-blur-md h-full`}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🚀</span>
                  <span>Your Commit Message</span>
                </h3>

                {result ? (
                  <div className="mt-2">
                    <pre className="text-base whitespace-pre-wrap break-words font-mono p-5 rounded-lg bg-gray-900/70 border border-gray-700 shadow-inner">
                      {result}
                    </pre>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                          copied
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 hover:bg-gray-600 text-white"
                        }`}
                      >
                        <span>{copied ? "✅" : "📋"}</span>
                        <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="text-6xl mb-4">🔮</div>
                    <p className="text-lg mb-2">
                      Your commit message will appear here
                    </p>
                    <p className="text-sm text-gray-400">
                      Fill out the form on the left and click generate
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && history.length > 0 && (
          <div className="p-6 rounded-2xl shadow-lg bg-gray-800/60 backdrop-blur-md border border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="text-2xl font-bold">Your Commit History</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border bg-gray-900/50 border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/50 text-indigo-300">
                        Commit #{history.length - i}
                      </span>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(msg)}
                      className="text-xs px-2 py-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
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
          <div className="p-8 rounded-2xl shadow-lg bg-gray-800/60 backdrop-blur-md border border-gray-700 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">No Commit History Yet</h3>
            <p className="text-gray-400 mb-6">
              Generate your first commit message to see it here
            </p>
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
