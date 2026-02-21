import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getRandomTopic } from '../constants/api';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Logo click — always picks a fresh random topic and goes home
  const handleLogoClick = () => {
    const currentTopic = new URLSearchParams(location.search).get("query") || "";
    const newTopic = getRandomTopic(currentTopic);
    navigate(`/?query=${newTopic}`);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">

      {/* Top Navbar */}
      <header className="w-full flex items-center px-4 py-2 bg-black border-b border-zinc-800 z-10">

        {/* ✅ Logo is now clickable */}
        <button
          onClick={handleLogoClick}
          className="text-red-600 font-bold text-2xl mr-8 shrink-0 cursor-pointer hover:text-red-500 transition select-none bg-transparent border-none outline-none"
        >
          ▶ MediaStream
        </button>

        <Navbar />
      </header>

      {/* Sidebar + Page Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black">
          {children}
        </main>
      </div>

    </div>
  );
};

export default Layout;