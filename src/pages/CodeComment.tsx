import { useState } from "react";
import { generateCodeComments } from "../utils/CodeComment";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeComment() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const commented = await generateCodeComments(code);
      setResult(commented);
    } catch (error) {
      setResult("// ❌ Failed to generate comments. Please try again.");
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[90vh]">
      {/* Input Panel */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <textarea
          rows={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="flex-grow p-4 font-mono border rounded-lg h-full resize-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 py-2 rounded-lg bg-indigo-600 text-white"
        >
          {loading ? "⏳ Generating..." : "✨ Generate Comments"}
        </button>
      </div>
      {/* Output Panel with Syntax Highlighting */}
      <div className="w-full md:w-1/2 flex flex-col h-full">
        <div className="flex-grow p-2 bg-gray-900 rounded-lg overflow-y-auto h-full">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            wrapLines
          >
            {result || "// Your commented code will appear here."}
          </SyntaxHighlighter>
        </div>
        {result && (
          <button
            onClick={handleCopy}
            className={`mt-4 self-start px-4 py-2 rounded-lg ${
              copied ? "bg-green-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
          </button>
        )}
      </div>
    </div>
  );
}
