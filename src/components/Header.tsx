import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
      <h4
        className="text-2
      xl font-bold text-white"
      >
        ⚡ DevMitra
      </h4>
      <nav className="flex space-x-6">
        <Link to="/" className="hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <Link
          to="/code-comment"
          className="hover:text-indigo-400 transition-colors"
        >
          Code Comment
        </Link>

        <Link
          to="/git-message"
          className="hover:text-indigo-400 transition-colors"
        >
          Git Message
        </Link>
      </nav>
    </header>
  );
}
