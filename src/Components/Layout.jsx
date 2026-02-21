import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Logo click — navigate to home with a unique timestamp key
  // This forces Home to fully remount and fetch a brand new mixed feed
  const handleLogoClick = () => {
    navigate(`/?refresh=${Date.now()}`);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="w-full flex items-center px-4 py-2 bg-black border-b border-zinc-800 z-10">
        <button
          onClick={handleLogoClick}
          className="text-red-600 font-bold text-2xl mr-8 shrink-0 cursor-pointer hover:text-red-500 transition select-none bg-transparent border-none outline-none"
        >
          ▶ MediaStream
        </button>
        <Navbar />
      </header>

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