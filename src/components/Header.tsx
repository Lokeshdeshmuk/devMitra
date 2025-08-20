import { useState } from 'react';
import { FaBolt, FaSun, FaMoon } from 'react-icons/fa';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ darkMode, toggleTheme, activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="w-full py-6 px-4 flex justify-between items-center border-b border-opacity-10 border-gray-500">
      <div className="flex items-center space-x-3">
        <FaBolt className="text-2xl text-yellow-400" />
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
          {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
        </button>
      </div>
    </header>
  );
}