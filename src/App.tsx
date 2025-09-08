import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GitMessage from "./pages/GitMessage";
import Home from "./pages/Home";
import CodeComment from "./pages/CodeComment";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/git-message" element={<GitMessage />} />
            <Route path="/code-comment" element={<CodeComment />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
