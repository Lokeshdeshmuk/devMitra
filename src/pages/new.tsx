import { useState, useRef, useEffect } from "react";
import { generateCodeComments } from "../utils/CodeComment";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Helper for textarea auto expand
const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

export default function CodeComment() {
  const [code, setCode] = useState("");
  const [written, setWritten] = useState(""); // last submitted code
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [inputHeight, setInputHeight] = useState(48);

  const textareaRef = useRef(null);

  // Expand input up to half screen on input
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${clamp(
        textareaRef.current.scrollHeight,
        48,
        window.innerHeight / 2
      )}px`;
      setInputHeight(textareaRef.current.offsetHeight);
    }
  }, [code]);

  // Submit handler (on Enter for textarea, or button)
  const handleGenerate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setWritten(code); // show the just-submitted code above output
    setCode("");
    try {
      const commented = await generateCodeComments(code);
      setResult(commented);
    } catch (error) {
      setResult("// ❌ Failed to generate comments. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key (with Shift for new line)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-screen bg-gray-950 flex flex-col-reverse items-center justify-end overflow-hidden">
      {/* Fixed Bottom Input */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:w-3/5 px-2 md:px-0 z-10"
        style={{
          background: "rgba(24,24,27,0.9)",
          boxShadow: "0 -2px 16px 0 rgba(0,0,0,0.25)",
        }}
      >
        <div className="py-4 flex flex-col">
          <textarea
            ref={textareaRef}
            rows={1}
            value={code}
            spellCheck={false}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              resize: "none",
              maxHeight: "50vh",
              minHeight: 48,
              height: inputHeight,
              overflowY: inputHeight >= window.innerHeight / 2 ? "auto" : "hidden",
            }}
            className="
              w-full rounded-lg border border-gray-700 bg-gray-800 text-white font-mono p-3
              outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition
              placeholder-gray-400
            "
            placeholder="Paste your code here. Shift+Enter for new line..."
            disabled={loading}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !code.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-40"
              style={{ minWidth: 48 }}
              aria-label="Generate Comments"
              type="button"
            >
              {/* Material/Arrow icon style */}
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>➔</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Above Input: Scrollable Area with User Input and Output */}
      <div
        className="flex flex-col-reverse w-full md:w-3/5 mx-auto"
        style={{
          marginBottom: `${inputHeight + 40}px`, // leave space for input bar
          height: `calc(100vh - ${inputHeight + 40}px)`,
          overflowY: "auto",
        }}
      >
        {written && (
          <div className="mb-6 px-2 md:px-0">
            <div className="text-xs uppercase text-indigo-400 mb-1 ml-1">Your Code</div>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ fontSize: 13, borderRadius: 8, padding: 18 }}>
              {written}
            </SyntaxHighlighter>
          </div>
        )}
        {result && (
          <div className="mb-10 px-2 md:px-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs uppercase text-green-400 ml-1">Commented Code</span>
              <button
                onClick={handleCopy}
                className={`ml-2 px-2 py-1 rounded ${
                  copied ? "bg-green-500 text-white" : "bg-gray-800 text-gray-300"
                } text-xs`}
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ fontSize: 13, borderRadius: 8, padding: 18 }}>
              {result}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}
