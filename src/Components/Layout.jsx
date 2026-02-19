import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Top Navbar */}
      <header className="w-full flex items-center px-4 py-2 bg-black border-b border-zinc-800 z-10">
        <span className="text-red-600 font-bold text-2xl mr-8 shrink-0">
          ▶ MediaStream
        </span>
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
