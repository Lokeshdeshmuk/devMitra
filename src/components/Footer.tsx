import { FaHeart, FaGithub } from 'react-icons/fa';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  return (
    <footer className={`w-full py-4 px-6 mt-auto border-t border-opacity-10 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span>Developed with</span>
          <FaHeart className="text-red-500" />
          <span>by Lokesh Deshmukh</span>
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center space-x-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
          >
            <FaGithub />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}